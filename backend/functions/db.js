// DynamoDB client and helpers

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

// Table names from environment variables (required)
const TABLES = {
  products: process.env.PRODUCTS_TABLE,
  subscribers: process.env.SUBSCRIBERS_TABLE,
  orders: process.env.ORDERS_TABLE,
};

if (!TABLES.products || !TABLES.subscribers || !TABLES.orders) {
  console.error("Missing required table environment variables: PRODUCTS_TABLE, SUBSCRIBERS_TABLE, ORDERS_TABLE");
}

/**
 * Get all products
 */
const getAllProducts = async () => {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: TABLES.products,
    })
  );
  return result.Items || [];
};

/**
 * Get single product by ID
 */
const getProduct = async (productId) => {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLES.products,
      Key: { id: productId },
    })
  );
  return result.Item;
};

/**
 * Upsert product (create or update)
 */
const putProduct = async (product) => {
  await dynamo.send(
    new PutCommand({
      TableName: TABLES.products,
      Item: {
        ...product,
        updatedAt: new Date().toISOString(),
      },
    })
  );
};

/**
 * Delete product by ID
 */
const deleteProduct = async (productId) => {
  await dynamo.send(
    new DeleteCommand({
      TableName: TABLES.products,
      Key: { id: productId },
    })
  );
};

/**
 * Update product stock status
 */
const updateProductStock = async (
  productId,
  variantId,
  inStock,
  quantity = null
) => {
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLES.products,
      Key: { id: productId },
      UpdateExpression: "SET stock.#variantId = :stockInfo, updatedAt = :now",
      ExpressionAttributeNames: {
        "#variantId": String(variantId),
      },
      ExpressionAttributeValues: {
        ":stockInfo": { inStock, quantity },
        ":now": new Date().toISOString(),
      },
    })
  );
};

/**
 * Add email subscriber
 */
const addSubscriber = async (email, source = "website") => {
  await dynamo.send(
    new PutCommand({
      TableName: TABLES.subscribers,
      Item: {
        email: email.toLowerCase().trim(),
        subscribedAt: new Date().toISOString(),
        source,
        status: "active",
      },
    })
  );
};

/**
 * Check if email already subscribed
 */
const getSubscriber = async (email) => {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLES.subscribers,
      Key: { email: email.toLowerCase().trim() },
    })
  );
  return result.Item;
};

/**
 * Store order reference
 */
const saveOrder = async (order) => {
  await dynamo.send(
    new PutCommand({
      TableName: TABLES.orders,
      Item: {
        ...order,
        createdAt: new Date().toISOString(),
      },
    })
  );
};

/**
 * Get order by ID
 */
const getOrder = async (orderId) => {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLES.orders,
      Key: { id: orderId },
    })
  );
  return result.Item;
};

/**
 * Update order status with audit trail
 */
const updateOrderStatus = async (orderId, status, opts = {}) => {
  // Backward compat: old callers pass fulfillmentOrderId as a string third arg
  if (typeof opts === "string") {
    opts = { fulfillmentOrderId: opts };
  }
  const { fulfillmentOrderId = null, fulfillmentStatus = null, source = "system" } = opts;
  const now = new Date().toISOString();
  const historyEntry = { status, timestamp: now, source };

  let updateParts = [
    "#status = :status",
    "updatedAt = :now",
    "statusHistory = list_append(if_not_exists(statusHistory, :emptyList), :historyEntry)",
  ];
  const names = { "#status": "status" };
  const values = {
    ":status": status,
    ":now": now,
    ":emptyList": [],
    ":historyEntry": [historyEntry],
  };

  if (fulfillmentOrderId) {
    updateParts.push("fulfillmentOrderId = :fId");
    values[":fId"] = fulfillmentOrderId;
  }

  if (fulfillmentStatus) {
    updateParts.push("fulfillmentStatus = :fStatus");
    values[":fStatus"] = fulfillmentStatus;
  }

  await dynamo.send(
    new UpdateCommand({
      TableName: TABLES.orders,
      Key: { id: orderId },
      UpdateExpression: `SET ${updateParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
};

/**
 * Append a shipment to an order's shipments array
 */
const addShipmentToOrder = async (orderId, shipment) => {
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLES.orders,
      Key: { id: orderId },
      UpdateExpression: "SET shipments = list_append(if_not_exists(shipments, :emptyList), :shipment), updatedAt = :now",
      ExpressionAttributeValues: {
        ":emptyList": [],
        ":shipment": [shipment],
        ":now": new Date().toISOString(),
      },
    })
  );
};

/**
 * Get orders by a single status
 */
const getOrdersByStatus = async (status) => {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: TABLES.orders,
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": status },
    })
  );
  return result.Items || [];
};

/**
 * Get orders matching any of the given statuses
 */
const getOrdersByStatuses = async (statuses) => {
  const names = { "#status": "status" };
  const values = {};
  const conditions = statuses.map((s, i) => {
    values[`:s${i}`] = s;
    return `#status = :s${i}`;
  });

  const result = await dynamo.send(
    new ScanCommand({
      TableName: TABLES.orders,
      FilterExpression: conditions.join(" OR "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
  return result.Items || [];
};

module.exports = {
  TABLES,
  dynamo,
  getAllProducts,
  getProduct,
  putProduct,
  deleteProduct,
  updateProductStock,
  addSubscriber,
  getSubscriber,
  saveOrder,
  getOrder,
  updateOrderStatus,
  addShipmentToOrder,
  getOrdersByStatus,
  getOrdersByStatuses,
};
