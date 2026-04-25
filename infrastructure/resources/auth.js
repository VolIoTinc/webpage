// Cognito user pool and client for admin authentication

const aws = require("@pulumi/aws");
const config = require("../config");

const userPool = new aws.cognito.UserPool(`${config.merchantName}-admin-${config.environment}`, {
  name: `${config.merchantName}-admin-${config.environment}`,
  adminCreateUserConfig: {
    allowAdminCreateUserOnly: true,
  },
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 1,
  },
  mfaConfiguration: "ON",
  softwareTokenMfaConfiguration: {
    enabled: true,
  },
  accountRecoverySetting: {
    recoveryMechanisms: [{
      name: "verified_email",
      priority: 1,
    }],
  },
  autoVerifiedAttributes: ["email"],
  schemas: [{
    name: "email",
    attributeDataType: "String",
    required: true,
    mutable: true,
    stringAttributeConstraints: {
      minLength: "1",
      maxLength: "256",
    },
  }],
  tags: config.defaultTags,
});

const userPoolClient = new aws.cognito.UserPoolClient(`${config.merchantName}-admin-client-${config.environment}`, {
  name: `${config.merchantName}-admin-client-${config.environment}`,
  userPoolId: userPool.id,
  explicitAuthFlows: [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ],
  accessTokenValidity: 1,
  idTokenValidity: 1,
  refreshTokenValidity: 7,
  tokenValidityUnits: {
    accessToken: "hours",
    idToken: "hours",
    refreshToken: "days",
  },
  generateSecret: false,
  preventUserExistenceErrors: "ENABLED",
});

module.exports = {
  userPool,
  userPoolClient,
};
