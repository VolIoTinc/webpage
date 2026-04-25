const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";

async function request(path, options = {}) {
  const { token, method = "GET", body } = options;

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

export const api = {
  getDashboard: (token) => request("/admin/dashboard", { token }),

  getOrders: (token, status) => {
    const query = status && status !== "all" ? `?status=${status}` : "";
    return request(`/admin/orders${query}`, { token });
  },

  updateOrder: (token, orderId, updates) =>
    request(`/admin/orders/${orderId}`, { token, method: "PUT", body: updates }),

  confirmOrder: (token, orderId) =>
    request(`/admin/orders/${orderId}/confirm`, { token, method: "POST" }),

  syncOrder: (token, orderId) =>
    request(`/admin/orders/${orderId}/sync`, { token, method: "POST" }),

  getProducts: (token) => request("/admin/products", { token }),

  updateProduct: (token, productId, updates) =>
    request(`/admin/products/${productId}`, { token, method: "PUT", body: updates }),

  createInvoice: (token, invoice) =>
    request("/admin/invoices", { token, method: "POST", body: invoice }),
};
