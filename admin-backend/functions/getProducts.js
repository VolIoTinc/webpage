// GET /admin/products - List all products (full detail for admin)

const { success, error } = require("./utils");
const { getAllProducts } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const products = await getAllProducts();

    products.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

    return success({
      products,
      count: products.length,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return error("Failed to fetch products", 500);
  }
};
