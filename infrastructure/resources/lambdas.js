// Storefront Lambda functions, IAM role, and API Gateway integrations

const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const config = require("../config");
const { productsTable, ordersTable, subscribersTable, rateLimitsTable } = require("./database");
const { api } = require("./api");

// Placeholder code that gets replaced on first deploy-backend step.
// Inlined so no placeholder.zip is needed on disk / in git.
const placeholderCode = new pulumi.asset.AssetArchive({
  "index.js": new pulumi.asset.StringAsset(
    "exports.handler = async () => ({ statusCode: 200, body: 'placeholder' });\n"
  ),
});

// Get current AWS account ID
const callerIdentity = aws.getCallerIdentityOutput();
const region = aws.getRegionOutput();

// IAM role for storefront Lambdas
const lambdaRole = new aws.iam.Role(`${config.merchantName}-lambda-${config.environment}`, {
  name: `${config.merchantName}-lambda-${config.environment}`,
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Principal: { Service: "lambda.amazonaws.com" },
    }],
  }),
  tags: config.defaultTags,
});

new aws.iam.RolePolicyAttachment(`${config.merchantName}-lambda-basic-${config.environment}`, {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const lambdaPolicy = new aws.iam.RolePolicy(`${config.merchantName}-lambda-permissions-${config.environment}`, {
  role: lambdaRole.id,
  policy: pulumi.all([
    productsTable.arn, ordersTable.arn, subscribersTable.arn, rateLimitsTable.arn,
    callerIdentity.accountId, region.name,
  ]).apply(([productsArn, ordersArn, subscribersArn, rateLimitsArn, accountId, regionName]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem",
            "dynamodb:DeleteItem", "dynamodb:Query", "dynamodb:Scan",
          ],
          Resource: [
            productsArn, `${productsArn}/index/*`,
            ordersArn, `${ordersArn}/index/*`,
            subscribersArn, `${subscribersArn}/index/*`,
            rateLimitsArn,
          ],
        },
        {
          Effect: "Allow",
          Action: ["secretsmanager:GetSecretValue"],
          Resource: `arn:aws:secretsmanager:${regionName}:${accountId}:secret:${config.secretsPrefix}/*`,
        },
        {
          Effect: "Allow",
          Action: ["ses:SendEmail", "ses:SendRawEmail"],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: ["sns:Publish"],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: ["kms:Decrypt"],
          Resource: `arn:aws:kms:${regionName}:${accountId}:key/*`,
        },
      ],
    })
  ),
});

// Common Lambda environment variables
const commonEnv = {
  PRODUCTS_TABLE: productsTable.name,
  ORDERS_TABLE: ordersTable.name,
  SUBSCRIBERS_TABLE: subscribersTable.name,
  RATE_LIMITS_TABLE: rateLimitsTable.name,
  ENV: config.environment,
  SITE_URL: `https://${config.websiteDomain}`,
  SITE_NAME: config.merchantName,
  CONTACT_EMAIL: config.contactEmail,
  FROM_EMAIL: config.fromEmail,
  SMS_NUMBER: config.smsNumber,
};

// Lambda function definitions
const functions = [
  { name: "getProducts", handler: "functions/getProducts.handler", timeout: 10, memory: 256 },
  { name: "subscribe", handler: "functions/subscribe.handler", timeout: 10, memory: 256 },
  { name: "handleContact", handler: "functions/handleContact.handler", timeout: 10, memory: 256 },
];

const lambdaFunctions = {};

for (const fn of functions) {
  const funcName = `${config.merchantName}-${fn.name}-${config.environment}`;

  const lambda = new aws.lambda.Function(funcName, {
    functionName: funcName,
    runtime: "nodejs22.x",
    handler: fn.handler,
    role: lambdaRole.arn,
    timeout: fn.timeout,
    memorySize: fn.memory,
    code: placeholderCode,
    environment: { variables: commonEnv },
    tags: config.defaultTags,
  });

  lambdaFunctions[fn.name] = lambda;
}

// API Gateway routes
const routes = [
  { method: "GET", path: "/products", fn: "getProducts" },
  { method: "GET", path: "/products/{id}", fn: "getProducts" },
  { method: "POST", path: "/subscribe", fn: "subscribe" },
  { method: "POST", path: "/contact", fn: "handleContact" },
];

for (const route of routes) {
  const lambda = lambdaFunctions[route.fn];
  const routeKey = `${route.method} ${route.path}`;
  const safeName = `${route.fn}-${route.method}-${route.path.replace(/[/{}]/g, "-")}`;

  const integration = new aws.apigatewayv2.Integration(`${safeName}-${config.environment}`, {
    apiId: api.id,
    integrationType: "AWS_PROXY",
    integrationUri: lambda.invokeArn,
    integrationMethod: "POST",
    payloadFormatVersion: "2.0",
  });

  new aws.apigatewayv2.Route(`${safeName}-route-${config.environment}`, {
    apiId: api.id,
    routeKey: routeKey,
    target: pulumi.interpolate`integrations/${integration.id}`,
  });

  new aws.lambda.Permission(`${safeName}-perm-${config.environment}`, {
    action: "lambda:InvokeFunction",
    function: lambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
  });
}

module.exports = {
  lambdaRole,
  lambdaFunctions,
};
