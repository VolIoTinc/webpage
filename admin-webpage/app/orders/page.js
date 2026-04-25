"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

const STATUS_OPTIONS = [
  "all",
  "pending_funds",
  "submitted_to_fulfillment",
  "fulfillment_pending",
  "in_production",
  "partial_shipment",
  "shipped",
  "on_hold",
  "canceled",
  "failed",
];

const STATUS_LABELS = {
  pending_funds: "Pending Funds",
  submitted_to_fulfillment: "Sent to Fulfillment",
  fulfillment_pending: "Fulfillment Pending",
  in_production: "In Production",
  partial_shipment: "Partially Shipped",
  shipped: "Shipped",
  on_hold: "On Hold",
  canceled: "Canceled",
  failed: "Failed",
};

const STATUS_STYLES = {
  pending_funds: "bg-yellow-100 text-yellow-700",
  submitted_to_fulfillment: "bg-purple-100 text-purple-700",
  fulfillment_pending: "bg-blue-100 text-blue-700",
  in_production: "bg-indigo-100 text-indigo-700",
  partial_shipment: "bg-orange-100 text-orange-700",
  shipped: "bg-green-100 text-green-700",
  on_hold: "bg-amber-100 text-amber-700",
  canceled: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};

const TERMINAL_STATUSES = ["shipped", "canceled", "failed"];

const formatAmount = (amountInCents, currency) => {
  const dollars = (amountInCents || 0) / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: currency || "usd",
  });
};

const truncateId = (id) => {
  if (!id) return "-";
  if (id.length <= 12) return id;
  return id.slice(-8).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function OrdersContent() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const result = await api.getOrders(token, statusFilter);
      setOrders(result.orders || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [getToken, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSendToFulfillment = async (orderId) => {
    try {
      const token = await getToken();
      await api.confirmOrder(token, orderId);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSync = async (orderId) => {
    try {
      setSyncing(orderId);
      const token = await getToken();
      await api.syncOrder(token, orderId);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
    setSyncing(null);
  };

  const handleCancel = async (orderId) => {
    try {
      const token = await getToken();
      await api.updateOrder(token, orderId, { status: "canceled" });
      loadOrders();
      setSelected(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-heading font-bold text-gray-900">Orders</h1>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                statusFilter === s
                  ? "bg-brand-purple text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 ml-2">
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 py-12 text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 bg-white rounded-lg p-12 text-center">No orders found</div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const isSelected = selected === order.id;
            const shipments = order.shipments || [];
            const statusHistory = order.statusHistory || [];

            return (
              <div
                key={order.id}
                className={`bg-white rounded-lg border transition-shadow ${
                  isSelected ? "border-brand-purple shadow-md" : "border-gray-200 shadow-sm hover:shadow"
                }`}
              >
                {/* Order row */}
                <button
                  onClick={() => setSelected(isSelected ? null : order.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-4"
                >
                  <div className="min-w-0 flex-1 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          #{truncateId(order.id)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                        }`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {order.customerEmail || "No email"}
                      </p>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatAmount(order.amountTotal, order.currency)}
                      </span>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="text-xs text-brand-purple font-medium">
                        {isSelected ? "Close" : "Details"}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded detail panel */}
                {isSelected && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50 rounded-b-lg">
                    {/* Order info grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Full Order ID</p>
                        <p className="text-gray-700 font-mono text-xs break-all">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Customer</p>
                        <p className="text-gray-700">{order.customerName || "-"}</p>
                        <p className="text-gray-500 text-xs">{order.customerEmail || "-"}</p>
                      </div>
                      {order.fulfillmentOrderId && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Fulfillment Order</p>
                          <p className="text-gray-700">{order.fulfillmentOrderId}</p>
                        </div>
                      )}
                      {order.notes && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Notes</p>
                          <p className="text-gray-700">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Shipments */}
                    {shipments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Shipments ({shipments.length})
                        </p>
                        <div className="space-y-2">
                          {shipments.map((s, i) => (
                            <div key={s.shipmentId || i} className="bg-white border border-gray-200 rounded-md px-3 py-2 text-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-700">{s.carrier || "Unknown"}</span>
                                  {s.trackingNumber && (
                                    <span className="text-gray-500">#{s.trackingNumber}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {s.shippedAt && (
                                    <span className="text-gray-400">{formatDate(s.shippedAt)}</span>
                                  )}
                                  {s.trackingUrl && (
                                    <a
                                      href={s.trackingUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-brand-purple hover:underline font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Track
                                    </a>
                                  )}
                                </div>
                              </div>
                              {s.items && s.items.length > 0 && (
                                <p className="text-gray-400 mt-1">
                                  {s.items.map((item) => `${item.quantity}x variant ${item.syncVariantId}`).join(", ")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status history */}
                    {statusHistory.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">Status History</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          {statusHistory.map((entry, i) => (
                            <span key={i} className="text-gray-400">
                              <span className="text-gray-600">{STATUS_LABELS[entry.status] || entry.status}</span>
                              {" "}
                              {formatDate(entry.timestamp)}
                              {entry.source && (
                                <span className="text-gray-300 ml-1">({entry.source})</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {order.status === "pending_funds" && (
                        <button
                          onClick={() => handleSendToFulfillment(order.id)}
                          className="px-3 py-1.5 bg-brand-purple text-white text-xs font-medium rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Send to Fulfillment
                        </button>
                      )}
                      {order.fulfillmentOrderId && !TERMINAL_STATUSES.includes(order.status) && (
                        <button
                          onClick={() => handleSync(order.id)}
                          disabled={syncing === order.id}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          {syncing === order.id ? "Syncing..." : "Sync with Fulfillment"}
                        </button>
                      )}
                      {!TERMINAL_STATUSES.includes(order.status) && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AdminLayout>
      <OrdersContent />
    </AdminLayout>
  );
}
