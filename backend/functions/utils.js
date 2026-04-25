// Shared utilities for Lambda functions

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};

/**
 * Standard success response
 */
const success = (data, statusCode = 200) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(data)
});

/**
 * Standard error response
 */
const error = (message, statusCode = 400) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: message })
});

/**
 * Parse request body safely
 */
const parseBody = (event) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Normalize a US phone number to E.164 (+1XXXXXXXXXX). Returns null if invalid.
 */
const normalizePhone = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
};

/**
 * Best-effort client IP from API Gateway event (HTTP API v2 or REST v1).
 */
const getClientIp = (event) => {
  return (
    event?.requestContext?.http?.sourceIp ||
    event?.requestContext?.identity?.sourceIp ||
    "unknown"
  );
};

module.exports = {
  CORS_HEADERS,
  success,
  error,
  parseBody,
  isValidEmail,
  normalizePhone,
  getClientIp,
};
