"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

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

function MetricCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-heading font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function DashboardContent() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const result = await api.getDashboard(token);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [getToken]);

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  const { metrics, statusCounts, recentActivity } = data;

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Orders" value={metrics.totalOrders} />
        <MetricCard
          label="Revenue (30d)"
          value={`$${metrics.totalRevenue}`}
          sub={`$${metrics.weekRevenue} this week`}
        />
        <MetricCard
          label="Orders (30d)"
          value={metrics.recentOrders}
          sub={`${metrics.weekOrders} this week`}
        />
        <MetricCard
          label="Products"
          value={metrics.totalProducts}
          sub={`${metrics.activeProducts} active`}
        />
      </div>

      {/* Status breakdown */}
      {Object.keys(statusCounts).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Order Status</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span
                key={status}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
                  STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="font-semibold">{count}</span>
                <span>{STATUS_LABELS[status] || status}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700">Recent Orders</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="p-5 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    #{truncateId(order.id)}
                  </span>
                  <span className="text-xs text-gray-400">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {formatAmount(order.amountTotal, order.currency)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                  }`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
