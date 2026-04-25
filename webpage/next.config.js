/** @type {import('next').NextConfig} */
const projectConfig = require("../project.config.json");

const env = process.env.ENV || "stage";
const siteUrl = env === "prod"
  ? `https://${projectConfig.rootDomain}`
  : `https://stage.${projectConfig.rootDomain}`;

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_DISPLAY_NAME: projectConfig.displayName,
    NEXT_PUBLIC_TAGLINE: projectConfig.tagline,
    NEXT_PUBLIC_DESCRIPTION: projectConfig.description,
    NEXT_PUBLIC_LOCATION: projectConfig.location,
    NEXT_PUBLIC_ROOT_DOMAIN: projectConfig.rootDomain,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || siteUrl,
    NEXT_PUBLIC_SMS_NUMBER: projectConfig.smsNumber,
  },
};

module.exports = nextConfig;
