// S3 bucket + CloudFront distribution + ACM certificate + Route53 for storefront

const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const config = require("../config");

// US East 1 provider (required for CloudFront certificates)
const usEast1 = new aws.Provider("us-east-1", { region: "us-east-1" });

// Route53 hosted zone (data source - must exist already)
const zone = aws.route53.getZoneOutput({ name: config.rootDomain });

// S3 bucket for website
const bucketName = `${config.environment}-${config.merchantName}`;
const bucket = new aws.s3.BucketV2(`website-${config.environment}`, {
  bucket: bucketName,
  tags: config.defaultTags,
});

const bucketPublicAccess = new aws.s3.BucketPublicAccessBlock(`website-public-${config.environment}`, {
  bucket: bucket.id,
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
});

const bucketWebsite = new aws.s3.BucketWebsiteConfigurationV2(`website-config-${config.environment}`, {
  bucket: bucket.id,
  indexDocument: { suffix: "index.html" },
  errorDocument: { key: config.isProd ? "404.html" : "index.html" },
});

const bucketPolicy = new aws.s3.BucketPolicy(`website-policy-${config.environment}`, {
  bucket: bucket.id,
  policy: bucket.arn.apply(arn => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `${arn}/*`,
    }],
  })),
}, { dependsOn: [bucketPublicAccess] });

// ACM certificate
const cert = new aws.acm.Certificate(`website-cert-${config.environment}`, {
  domainName: config.websiteDomain,
  validationMethod: "DNS",
  tags: config.defaultTags,
}, { provider: usEast1 });

// DNS validation records
const certValidation = new aws.route53.Record(`website-cert-validation-${config.environment}`, {
  zoneId: zone.zoneId,
  name: cert.domainValidationOptions[0].resourceRecordName,
  type: cert.domainValidationOptions[0].resourceRecordType,
  records: [cert.domainValidationOptions[0].resourceRecordValue],
  ttl: 60,
});

const certValidated = new aws.acm.CertificateValidation(`website-cert-validated-${config.environment}`, {
  certificateArn: cert.arn,
  validationRecordFqdns: [certValidation.fqdn],
}, { provider: usEast1 });

// CloudFront distribution
const distributionArgs = {
  enabled: true,
  isIpv6Enabled: true,
  defaultRootObject: "index.html",
  aliases: [config.websiteDomain],
  priceClass: config.cloudfrontPriceClass,

  origins: [{
    originId: "s3-website",
    domainName: bucketWebsite.websiteEndpoint,
    customOriginConfig: {
      httpPort: 80,
      httpsPort: 443,
      originProtocolPolicy: "http-only",
      originSslProtocols: ["TLSv1.2"],
    },
  }],

  defaultCacheBehavior: {
    targetOriginId: "s3-website",
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD"],
    compress: true,
    defaultTtl: 86400,
    maxTtl: 31536000,
    forwardedValues: {
      queryString: false,
      cookies: { forward: "none" },
    },
  },

  customErrorResponses: [
    { errorCode: 403, responseCode: 200, responsePagePath: "/index.html" },
    { errorCode: 404, responseCode: 200, responsePagePath: "/index.html", errorCachingMinTtl: config.isProd ? 30 : 0 },
  ],

  viewerCertificate: {
    acmCertificateArn: certValidated.certificateArn,
    sslSupportMethod: "sni-only",
    minimumProtocolVersion: "TLSv1.2_2021",
  },

  restrictions: {
    geoRestriction: { restrictionType: "none" },
  },

  tags: config.defaultTags,
};

// Add WAF if configured
if (config.wafAclArn) {
  distributionArgs.webAclId = config.wafAclArn;
}

const distribution = new aws.cloudfront.Distribution(`website-cf-${config.environment}`, distributionArgs);

// Route53 alias record
const dnsRecord = new aws.route53.Record(`website-dns-${config.environment}`, {
  zoneId: zone.zoneId,
  name: config.websiteDomain,
  type: "A",
  aliases: [{
    name: distribution.domainName,
    zoneId: distribution.hostedZoneId,
    evaluateTargetHealth: false,
  }],
});

module.exports = {
  bucket,
  distribution,
  usEast1,
  zone,
};
