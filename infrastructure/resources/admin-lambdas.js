// Admin Lambda functions, IAM role, and API Gateway integrations

const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const config = require("../config");
const { productsTable, ordersTable, subscribersTable } = require("./database");
const { api, authorizer } = require("./admin-api");

// Placeholder code replaced on first deploy-admin-backend step (inlined so no
// placeholder.zip is needed on disk / in git).
const placeholderCode = new pulumi.asset.AssetArchive({
  "index.js": new pulumi.asset.StringAsset(
    "exports.handler = async () => ({ statusCode: 200, body: 'placeholder' });\n"
  ),
});

// Get current AWS account ID
const callerIdentity = aws.getCallerIdentityOutput();
const region = aws.getRegionOutput();

// IAM role for admin Lambdas
const adminLambdaRole = new aws.iam.Role(`${config.merchantName}-admin-lambda-${config.environment}`, {
  name: `${config.merchantName}-admin-lambda-${config.environment}`,
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

new aws.iam.RolePolicyAttachment(`${config.merchantName}-admin-lambda-basic-${config.environment}`, {
  role: adminLambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const adminLambdaPolicy = new aws.iam.RolePolicy(`${config.merchantName}-admin-lambda-permissions-${config.environment}`, {
  role: adminLambdaRole.id,
  policy: pulumi.all([
    productsTable.arn, ordersTable.arn, subscribersTable.arn,
    callerIdentity.accountId, region.name,
  ]).apply(([productsArn, ordersArn, subscribersArn, accountId, regionName]) =>
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
          Action: ["kms:Decrypt"],
          Resource: `arn:aws:kms:${regionName}:${accountId}:key/*`,
        },
      ],
    })
  ),
});

// Common environment variables
const commonEnv = {
  PRODUCTS_TABLE: productsTable.name,
  ORDERS_TABLE: ordersTable.name,
  ENV: config.environment,
};

// Admin Lambda function definitions
const functions = [
  { name: "getDashboard", handler: "functions/getDashboard.handler", timeout: 30, memory: 256 },
  { name: "getOrders", handler: "functions/getOrders.handler", timeout: 30, memory: 256 },
  { name: "getProducts", handler: "functions/getProducts.handler", timeout: 10, memory: 256 },
  { name: "updateOrder", handler: "functions/updateOrder.handler", timeout: 10, memory: 256 },
  { name: "updateProduct", handler: "functions/updateProduct.handler", timeout: 10, memory: 256 },
  { name: "createInvoice", handler: "functions/createInvoice.handler", timeout: 30, memory: 256 },
];

const adminLambdaFunctions = {};

for (const fn of functions) {
  const funcName = `${config.merchantName}-admin-${fn.name}-${config.environment}`;

  const lambda = new aws.lambda.Function(funcName, {
    functionName: funcName,
    runtime: "nodejs22.x",
    handler: fn.handler,
    role: adminLambdaRole.arn,
    timeout: fn.timeout,
    memorySize: fn.memory,
    code: placeholderCode,
    environment: { variables: commonEnv },
    tags: config.defaultTags,
  });

  adminLambdaFunctions[fn.name] = lambda;
}

// Admin API Gateway routes (all require Cognito auth)
const routes = [
  { method: "GET", path: "/admin/dashboard", fn: "getDashboard" },
  { method: "GET", path: "/admin/orders", fn: "getOrders" },
  { method: "GET", path: "/admin/orders/{id}", fn: "getOrders" },
  { method: "PUT", path: "/admin/orders/{id}", fn: "updateOrder" },
  { method: "GET", path: "/admin/products", fn: "getProducts" },
  { method: "PUT", path: "/admin/products/{id}", fn: "updateProduct" },
  { method: "POST", path: "/admin/invoices", fn: "createInvoice" },
];

for (const route of routes) {
  const lambda = adminLambdaFunctions[route.fn];
  const routeKey = `${route.method} ${route.path}`;
  const safeName = `admin-${route.fn}-${route.method}-${route.path.replace(/[/{}]/g, "-")}`;

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
    authorizationType: "JWT",
    authorizerId: authorizer.id,
  });

  new aws.lambda.Permission(`${safeName}-perm-${config.environment}`, {
    action: "lambda:InvokeFunction",
    function: lambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
  });
}

module.exports = {
  adminLambdaRole,
  adminLambdaFunctions,
};
