// PUT /admin/products/{id} - Update product metadata

const { success, error, parseBody } = require("./utils");
const { getProduct, updateProduct } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const productId = event.pathParameters?.id;
    if (!productId) {
      return error("Product ID is required");
    }

    const existing = await getProduct(productId);
    if (!existing) {
      return error("Product not found", 404);
    }

    const body = parseBody(event);
    const allowedFields = [
      "name", "description", "category", "bestseller", "new",
      "image", "images", "sizeGuide"
    ];
    const updates = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return error("No valid fields to update");
    }

    await updateProduct(productId, updates);

    return success({ message: "Product updated", productId });
  } catch (err) {
    console.error("Error updating product:", err);
    return error("Failed to update product", 500);
  }
};
