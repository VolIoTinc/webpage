// Merges project-wide config (project.config.json at repo root) with the
// Pulumi stack's environment-specific config (Pulumi.<stack>.yaml).

const pulumi = require("@pulumi/pulumi");
const projectConfig = require("../project.config.json");

// Stack config uses a fixed "bootstrap:" namespace (see Pulumi.<stack>.yaml)
// so nothing needs to change per-project beyond project.config.json + Pulumi.yaml's `name`.
const stack = new pulumi.Config("bootstrap");

// From project.config.json (identity of the project — same across environments)
const merchantName = projectConfig.projectName;
const rootDomain = projectConfig.rootDomain;
const contactEmail = projectConfig.contactEmail || "";
const fromEmail = projectConfig.fromEmail || "";
const smsNumber = projectConfig.smsNumber || "";

// From the Pulumi stack (env-specific knobs only)
const environment = stack.require("environment");
const cloudfrontPriceClass =
  stack.get("cloudfrontPriceClass") || "PriceClass_100";
const wafAclArn = stack.get("wafAclArn") || undefined;
const corsAllowedOrigins = stack.getObject("corsAllowedOrigins") || [];

// Derived values
const isProd = environment === "prod";
const websiteDomain = isProd ? rootDomain : `stage.${rootDomain}`;
const adminDomain = isProd
  ? `admin.${rootDomain}`
  : `admin.stage.${rootDomain}`;
const secretsPrefix = `${merchantName}/${environment}`;

const allCorsOrigins = [`https://${websiteDomain}`, ...corsAllowedOrigins];

const adminCorsOrigins = [`https://${adminDomain}`, ...corsAllowedOrigins];

const defaultTags = {
  Environment: environment,
  Project: merchantName,
  ManagedBy: "pulumi",
};

module.exports = {
  merchantName,
  rootDomain,
  environment,
  contactEmail,
  fromEmail,
  smsNumber,
  cloudfrontPriceClass,
  wafAclArn,
  isProd,
  websiteDomain,
  adminDomain,
  secretsPrefix,
  allCorsOrigins,
  adminCorsOrigins,
  defaultTags,
};
