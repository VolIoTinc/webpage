// Shared utilities for Admin Lambda functions

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
};

const success = (data, statusCode = 200) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(data)
});

const error = (message, statusCode = 400) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: message })
});

const parseBody = (event) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {};
  }
};

module.exports = {
  CORS_HEADERS,
  success,
  error,
  parseBody
};
