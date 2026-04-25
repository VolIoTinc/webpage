// PUT /admin/orders/{id} - Update order status/details

const { success, error, parseBody } = require("./utils");
const { getOrder, updateOrder } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const orderId = event.pathParameters?.id;
    if (!orderId) {
      return error("Order ID is required");
    }

    const existing = await getOrder(orderId);
    if (!existing) {
      return error("Order not found", 404);
    }

    const body = parseBody(event);
    const allowedFields = ["status", "notes", "trackingNumber", "fulfillmentOrderId"];
    const updates = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return error("No valid fields to update");
    }

    await updateOrder(orderId, updates);

    return success({ message: "Order updated", orderId });
  } catch (err) {
    console.error("Error updating order:", err);
    return error("Failed to update order", 500);
  }
};
