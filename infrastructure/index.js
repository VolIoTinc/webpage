// Main Pulumi program — project identity lives in /project.config.json.

// Install our error-printers BEFORE Pulumi's handlers. Pulumi pipes errors
// through util.inspect, which has a RangeError regression on some Node versions
// that masks the real error. prependListener runs our handler first so we get
// the real message printed to stderr, then we exit before Pulumi's handler
// runs.
process.prependListener("uncaughtException", (err) => {
  const msg = err && err.message ? err.message : String(err);
  const stack = err && err.stack ? err.stack : "(no stack)";
  console.error("=== Uncaught exception in Pulumi program ===");
  console.error("message:", msg);
  console.error("stack:", stack);
  if (err && err.cause) {
    const cmsg = err.cause.message ? err.cause.message : String(err.cause);
    console.error("cause:", cmsg);
    if (err.cause.stack) console.error("cause stack:", err.cause.stack);
  }
  process.exit(1);
});

process.prependListener("unhandledRejection", (reason) => {
  const msg = reason && reason.message ? reason.message : String(reason);
  console.error("=== Unhandled promise rejection ===");
  console.error("reason:", msg);
  if (reason && reason.stack) console.error("stack:", reason.stack);
  process.exit(1);
});

const config = require("./config");
const database = require("./resources/database");
const website = require("./resources/website");
const api = require("./resources/api");
const lambdas = require("./resources/lambdas");
const adminWebsite = require("./resources/admin-website");
const adminApi = require("./resources/admin-api");
const auth = require("./resources/auth");
const adminLambdas = require("./resources/admin-lambdas");

// Exports (available as stack outputs)
module.exports = {
  websiteUrl: `https://${config.websiteDomain}`,
  adminUrl: `https://${config.adminDomain}`,
  websiteBucketName: website.bucket.id,
  adminBucketName: adminWebsite.bucket.id,
  cloudfrontDistributionId: website.distribution.id,
  adminCloudfrontDistributionId: adminWebsite.distribution.id,
  apiGatewayUrl: api.apiEndpoint,
  adminApiGatewayUrl: adminApi.apiEndpoint,
  cognitoUserPoolId: auth.userPool.id,
  cognitoClientId: auth.userPoolClient.id,
};
