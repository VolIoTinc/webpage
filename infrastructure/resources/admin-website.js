// S3 bucket + CloudFront (OAC) + ACM cert + Route53 for admin panel

const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const config = require("../config");
const { usEast1, zone } = require("./website");

// S3 bucket for admin (private, accessed via CloudFront OAC)
const bucket = new aws.s3.BucketV2(`admin-${config.environment}`, {
  bucket: `admin-${config.environment}-${config.merchantName}`,
  tags: config.defaultTags,
});

const bucketPublicAccess = new aws.s3.BucketPublicAccessBlock(`admin-public-${config.environment}`, {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

const bucketWebsite = new aws.s3.BucketWebsiteConfigurationV2(`admin-config-${config.environment}`, {
  bucket: bucket.id,
  indexDocument: { suffix: "index.html" },
  errorDocument: { key: "index.html" },
});

// Origin Access Control for CloudFront → S3
const oac = new aws.cloudfront.OriginAccessControl(`admin-oac-${config.environment}`, {
  name: `admin-${config.environment}-${config.merchantName}-oac`,
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});

// ACM certificate
const cert = new aws.acm.Certificate(`admin-cert-${config.environment}`, {
  domainName: config.adminDomain,
  validationMethod: "DNS",
  tags: config.defaultTags,
}, { provider: usEast1 });

const certValidation = new aws.route53.Record(`admin-cert-validation-${config.environment}`, {
  zoneId: zone.zoneId,
  name: cert.domainValidationOptions[0].resourceRecordName,
  type: cert.domainValidationOptions[0].resourceRecordType,
  records: [cert.domainValidationOptions[0].resourceRecordValue],
  ttl: 60,
});

const certValidated = new aws.acm.CertificateValidation(`admin-cert-validated-${config.environment}`, {
  certificateArn: cert.arn,
  validationRecordFqdns: [certValidation.fqdn],
}, { provider: usEast1 });

// CloudFront distribution
const distribution = new aws.cloudfront.Distribution(`admin-cf-${config.environment}`, {
  enabled: true,
  isIpv6Enabled: true,
  defaultRootObject: "index.html",
  aliases: [config.adminDomain],
  priceClass: "PriceClass_100",

  origins: [{
    originId: "s3-admin",
    domainName: bucket.bucketRegionalDomainName,
    originAccessControlId: oac.id,
  }],

  defaultCacheBehavior: {
    targetOriginId: "s3-admin",
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD"],
    compress: true,
    defaultTtl: 3600,
    maxTtl: 86400,
    forwardedValues: {
      queryString: false,
      cookies: { forward: "none" },
    },
  },

  customErrorResponses: [
    { errorCode: 403, responseCode: 200, responsePagePath: "/index.html" },
    { errorCode: 404, responseCode: 200, responsePagePath: "/index.html" },
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
});

// S3 bucket policy allowing CloudFront OAC
const bucketPolicy = new aws.s3.BucketPolicy(`admin-policy-${config.environment}`, {
  bucket: bucket.id,
  policy: pulumi.all([bucket.arn, distribution.arn]).apply(([bucketArn, distArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Sid: "AllowCloudFrontOAC",
        Effect: "Allow",
        Principal: { Service: "cloudfront.amazonaws.com" },
        Action: "s3:GetObject",
        Resource: `${bucketArn}/*`,
        Condition: {
          StringEquals: {
            "AWS:SourceArn": distArn,
          },
        },
      }],
    })
  ),
});

// Route53 alias record
const dnsRecord = new aws.route53.Record(`admin-dns-${config.environment}`, {
  zoneId: zone.zoneId,
  name: config.adminDomain,
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
};
