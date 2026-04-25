// GET /admin/dashboard - Dashboard metrics

const { success, error } = require("./utils");
const { getAllOrders, getAllProducts } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }

    const [orders, products] = await Promise.all([
      getAllOrders(),
      getAllProducts(),
    ]);

    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    const recentOrders = orders.filter(o => o.createdAt >= thirtyDaysAgo);
    const weekOrders = orders.filter(o => o.createdAt >= sevenDaysAgo);

    const totalRevenue = recentOrders.reduce((sum, o) => {
      return sum + (parseInt(o.amountTotal, 10) || 0);
    }, 0) / 100;

    const weekRevenue = weekOrders.reduce((sum, o) => {
      return sum + (parseInt(o.amountTotal, 10) || 0);
    }, 0) / 100;

    const statusCounts = {};
    orders.forEach(o => {
      const s = o.status || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const recentActivity = orders
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .slice(0, 10)
      .map(o => ({
        id: o.id,
        status: o.status,
        amountTotal: o.amountTotal,
        currency: o.currency,
        createdAt: o.createdAt,
        customerEmail: o.customerEmail,
      }));

    return success({
      metrics: {
        totalOrders: orders.length,
        recentOrders: recentOrders.length,
        weekOrders: weekOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
        weekRevenue: weekRevenue.toFixed(2),
        totalProducts: products.length,
        activeProducts: products.filter(p => p.inStock !== false).length,
      },
      statusCounts,
      recentActivity,
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    return error("Failed to fetch dashboard data", 500);
  }
};
