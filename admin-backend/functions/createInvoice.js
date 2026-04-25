// POST /admin/invoices - Create a custom order/invoice

const { success, error, parseBody } = require("./utils");
const { saveOrder } = require("./db");
const crypto = require("crypto");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const body = parseBody(event);

    if (!body.customerEmail || !body.items || !body.items.length) {
      return error("customerEmail and items are required");
    }

    const total = body.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    }, 0);

    const order = {
      id: `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      type: "invoice",
      status: "pending",
      customerEmail: body.customerEmail,
      customerName: body.customerName || "",
      items: body.items,
      total: total.toFixed(2),
      notes: body.notes || "",
      createdBy: "admin",
    };

    await saveOrder(order);

    return success({ message: "Invoice created", order }, 201);
  } catch (err) {
    console.error("Error creating invoice:", err);
    return error("Failed to create invoice", 500);
  }
};
