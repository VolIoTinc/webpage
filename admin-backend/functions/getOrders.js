// GET /admin/orders - List all orders with optional status filter

const { success, error } = require("./utils");
const { getAllOrders } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const status = event.queryStringParameters?.status;

    let orders = await getAllOrders();

    if (status && status !== "all") {
      orders = orders.filter(o => o.status === status);
    }

    orders.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return success({
      orders,
      count: orders.length,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return error("Failed to fetch orders", 500);
  }
};
