// DynamoDB client and helpers for Admin functions

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const TABLES = {
  products: process.env.PRODUCTS_TABLE,
  orders: process.env.ORDERS_TABLE,
};

if (!TABLES.products || !TABLES.orders) {
  console.error("Missing required table environment variables: PRODUCTS_TABLE, ORDERS_TABLE");
}

const getAllProducts = async () => {
  const result = await dynamo.send(
    new ScanCommand({ TableName: TABLES.products })
  );
  return result.Items || [];
};

const getProduct = async (productId) => {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLES.products,
      Key: { id: productId },
    })
  );
  return result.Item;
};

const updateProduct = async (productId, updates) => {
  const expressions = [];
  const names = {};
  const values = {};

  Object.entries(updates).forEach(([key, value], i) => {
    expressions.push(`#k${i} = :v${i}`);
    names[`#k${i}`] = key;
    values[`:v${i}`] = value;
  });

  expressions.push("#updatedAt = :now");
  names["#updatedAt"] = "updatedAt";
  values[":now"] = new Date().toISOString();

  await dynamo.send(
    new UpdateCommand({
      TableName: TABLES.products,
      Key: { id: productId },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
};

const getAllOrders = async () => {
  const result = await dynamo.send(
    new ScanCommand({ TableName: TABLES.orders })
  );
  return result.Items || [];
};

const getOrder = async (orderId) => {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLES.orders,
      Key: { id: orderId },
    })
  );
  return result.Item;
};

const updateOrder = async (orderId, updates) => {
  const expressions = [];
  const names = {};
  const values = {};

  Object.entries(updates).forEach(([key, value], i) => {
    if (key === "status") {
      expressions.push("#status = :v" + i);
      names["#status"] = "status";
    } else {
      expressions.push(`#k${i} = :v${i}`);
      names[`#k${i}`] = key;
    }
    values[`:v${i}`] = value;
  });

  expressions.push("#updatedAt = :now");
  names["#updatedAt"] = "updatedAt";
  values[":now"] = new Date().toISOString();

  await dynamo.send(
    new UpdateCommand({
      TableName: TABLES.orders,
      Key: { id: orderId },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
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

module.exports = {
  TABLES,
  dynamo,
  getAllProducts,
  getProduct,
  updateProduct,
  getAllOrders,
  getOrder,
  updateOrder,
  updateOrderStatus,
  addShipmentToOrder,
  getOrdersByStatuses,
  saveOrder,
};
