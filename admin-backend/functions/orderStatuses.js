// Order status constants for admin dashboard display

const ORDER_STATUSES = {
  PENDING_FUNDS: "pending_funds",
  SUBMITTED_TO_FULFILLMENT: "submitted_to_fulfillment",
  FULFILLMENT_PENDING: "fulfillment_pending",
  IN_PRODUCTION: "in_production",
  PARTIAL_SHIPMENT: "partial_shipment",
  SHIPPED: "shipped",
  ON_HOLD: "on_hold",
  CANCELED: "canceled",
  FAILED: "failed",
};

// Orders still moving through the pipeline
const ACTIVE_STATUSES = [
  ORDER_STATUSES.PENDING_FUNDS,
  ORDER_STATUSES.SUBMITTED_TO_FULFILLMENT,
  ORDER_STATUSES.FULFILLMENT_PENDING,
  ORDER_STATUSES.IN_PRODUCTION,
  ORDER_STATUSES.PARTIAL_SHIPMENT,
  ORDER_STATUSES.ON_HOLD,
];

// Orders that have reached a final state
const TERMINAL_STATUSES = [
  ORDER_STATUSES.SHIPPED,
  ORDER_STATUSES.CANCELED,
  ORDER_STATUSES.FAILED,
];

module.exports = {
  ORDER_STATUSES,
  ACTIVE_STATUSES,
  TERMINAL_STATUSES,
};
