// DynamoDB-backed rate limiter. One row per (key) with a TTL-expiring counter.
// Keys are arbitrary strings like "ip:1.2.3.4", "phone:+15551234567", "email:foo@bar".

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.RATE_LIMITS_TABLE;
if (!TABLE) console.error("Missing required RATE_LIMITS_TABLE environment variable");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const WINDOW_SECONDS = 24 * 60 * 60;

/**
 * Atomically increment one rate-limit key. Returns the new count.
 * Sets a TTL of WINDOW_SECONDS from the FIRST hit (if_not_exists), so the
 * window is fixed (not sliding) per key — a key resets 24h after the first
 * submission within the window.
 */
async function incrementKey(key) {
  const ttl = Math.floor(Date.now() / 1000) + WINDOW_SECONDS;
  const result = await dynamo.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { key },
      UpdateExpression: "ADD #c :one SET #t = if_not_exists(#t, :ttl)",
      ExpressionAttributeNames: { "#c": "count", "#t": "ttl" },
      ExpressionAttributeValues: { ":one": 1, ":ttl": ttl },
      ReturnValues: "UPDATED_NEW",
    })
  );
  return result.Attributes?.count ?? 0;
}

/**
 * Increment the given keys and return { allowed, exceededKey } where allowed
 * is false if any key's count exceeds `limit`.
 */
async function checkAndRecord(keys, limit = 5) {
  for (const key of keys) {
    if (!key) continue;
    const count = await incrementKey(key);
    if (count > limit) {
      return { allowed: false, exceededKey: key, count };
    }
  }
  return { allowed: true };
}

module.exports = { checkAndRecord, WINDOW_SECONDS };
