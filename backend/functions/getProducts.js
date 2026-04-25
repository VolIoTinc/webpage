// GET /products - Return all products with stock status

const { success, error } = require("./utils");
const { getAllProducts } = require("./db");

exports.handler = async (event) => {
  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    // Get optional category filter
    const category = event.queryStringParameters?.category;

    // Fetch products from DynamoDB
    let products = await getAllProducts();

    // Filter by category if provided
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    // Transform for frontend
    const publicProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      images: p.images || [],
      variants: p.variants || [],
      sizes: p.sizes || [],
      colors: p.colors || [],
      stock: p.stock || {},
      bestseller: p.bestseller || false,
      new: p.new || false,
      hasSizes: p.hasSizes || false,
      hasColors: p.hasColors || false,
      inStock: p.inStock !== false,
      allInStock: p.allInStock || false,
      defaultVariantId: p.defaultVariantId || null,
      sizeGuide: p.sizeGuide || null,
    }));

    return success({
      products: publicProducts,
      count: publicProducts.length,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return error("Failed to fetch products", 500);
  }
};
