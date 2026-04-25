// Admin API Gateway with Cognito authorizer

const aws = require("@pulumi/aws");
const config = require("../config");
const { userPool, userPoolClient } = require("./auth");

const api = new aws.apigatewayv2.Api(`${config.merchantName}-admin-api-${config.environment}`, {
  name: `${config.merchantName}-admin-api-${config.environment}`,
  protocolType: "HTTP",
  corsConfiguration: {
    allowOrigins: config.adminCorsOrigins,
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["content-type", "authorization"],
    maxAge: 300,
  },
  tags: config.defaultTags,
});

const stage = new aws.apigatewayv2.Stage(`${config.merchantName}-admin-api-stage-${config.environment}`, {
  apiId: api.id,
  name: "$default",
  autoDeploy: true,
});

const authorizer = new aws.apigatewayv2.Authorizer(`${config.merchantName}-admin-cognito-${config.environment}`, {
  apiId: api.id,
  authorizerType: "JWT",
  name: `${config.merchantName}-admin-cognito-${config.environment}`,
  identitySources: ["$request.header.Authorization"],
  jwtConfiguration: {
    audiences: [userPoolClient.id],
    issuer: userPool.endpoint.apply(endpoint => `https://${endpoint}`),
  },
});

const apiEndpoint = api.apiEndpoint;

module.exports = {
  api,
  stage,
  authorizer,
  apiEndpoint,
};
