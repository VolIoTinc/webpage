// DynamoDB tables

const aws = require("@pulumi/aws");
const config = require("../config");

const productsTable = new aws.dynamodb.Table(
  `${config.merchantName}-Products-${config.environment}`,
  {
    name: `${config.merchantName}-Products-${config.environment}`,
    billingMode: "PAY_PER_REQUEST",
    hashKey: "id",
    attributes: [{ name: "id", type: "S" }],
    tags: config.defaultTags,
  }
);

const ordersTable = new aws.dynamodb.Table(
  `${config.merchantName}-Orders-${config.environment}`,
  {
    name: `${config.merchantName}-Orders-${config.environment}`,
    billingMode: "PAY_PER_REQUEST",
    hashKey: "id",
    attributes: [{ name: "id", type: "S" }],
    tags: config.defaultTags,
  }
);

const subscribersTable = new aws.dynamodb.Table(
  `${config.merchantName}-EmailSubscribers-${config.environment}`,
  {
    name: `${config.merchantName}-EmailSubscribers-${config.environment}`,
    billingMode: "PAY_PER_REQUEST",
    hashKey: "email",
    attributes: [{ name: "email", type: "S" }],
    tags: config.defaultTags,
  }
);

const rateLimitsTable = new aws.dynamodb.Table(
  `${config.merchantName}-RateLimits-${config.environment}`,
  {
    name: `${config.merchantName}-RateLimits-${config.environment}`,
    billingMode: "PAY_PER_REQUEST",
    hashKey: "key",
    attributes: [{ name: "key", type: "S" }],
    ttl: { attributeName: "ttl", enabled: true },
    tags: config.defaultTags,
  }
);

module.exports = {
  productsTable,
  ordersTable,
  subscribersTable,
  rateLimitsTable,
};
