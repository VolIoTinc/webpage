// API Gateway for storefront

const aws = require("@pulumi/aws");
const config = require("../config");

const api = new aws.apigatewayv2.Api(`${config.merchantName}-api-${config.environment}`, {
  name: `${config.merchantName}-api-${config.environment}`,
  protocolType: "HTTP",
  corsConfiguration: {
    allowOrigins: config.allCorsOrigins,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["content-type", "x-api-key"],
    maxAge: 300,
  },
  tags: config.defaultTags,
});

const stage = new aws.apigatewayv2.Stage(`${config.merchantName}-api-stage-${config.environment}`, {
  apiId: api.id,
  name: "$default",
  autoDeploy: true,
});

const apiEndpoint = api.apiEndpoint;

module.exports = {
  api,
  stage,
  apiEndpoint,
};
