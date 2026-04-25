#!/bin/bash
# scripts/deploy-frontend.sh
#
# Build the webpage/ Next.js site and push it to S3 + CloudFront.
# Reads project identity from /project.config.json and runtime values from
# Pulumi stack outputs — nothing else to configure.
#
# Usage:
#   ./scripts/deploy-frontend.sh [stage|prod]

set -e

ENV="${1:-stage}"
if [ "$ENV" != "stage" ] && [ "$ENV" != "prod" ]; then
  echo "Invalid environment. Use 'stage' or 'prod'"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$REPO_ROOT/project.config.json"

MERCHANT_NAME="$(jq -r .projectName "$CONFIG")"
ROOT_DOMAIN="$(jq -r .rootDomain "$CONFIG")"
AWS_REGION="$(jq -r '.awsRegion // "us-east-2"' "$CONFIG")"

if [ "$ENV" = "prod" ]; then
  S3_BUCKET="$MERCHANT_NAME"
  SITE_URL="https://${ROOT_DOMAIN}"
else
  S3_BUCKET="stage-${MERCHANT_NAME}"
  SITE_URL="https://stage.${ROOT_DOMAIN}"
fi

# Pull CloudFront dist ID and API Gateway URL from Pulumi outputs
cd "$REPO_ROOT/infrastructure"
CF_DISTRIBUTION_ID="$(pulumi stack output --stack "$ENV" cloudfrontDistributionId)"
API_URL="$(pulumi stack output --stack "$ENV" apiGatewayUrl)"

echo "=============================================="
echo "  Deploying Frontend to: $ENV"
echo "  Merchant:     $MERCHANT_NAME"
echo "  S3 Bucket:    $S3_BUCKET"
echo "  CloudFront:   $CF_DISTRIBUTION_ID"
echo "  Site URL:     $SITE_URL"
echo "=============================================="

cd "$REPO_ROOT/webpage"
[ -d node_modules ] || npm ci

export ENV
export NEXT_PUBLIC_API_URL="$API_URL"
export NEXT_PUBLIC_SITE_URL="$SITE_URL"

rm -rf .next out
npm run build

echo ""
echo "Syncing to S3..."
aws s3 sync out/ "s3://${S3_BUCKET}/" \
  --delete --exclude "*" --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --region "$AWS_REGION"

aws s3 sync out/ "s3://${S3_BUCKET}/" \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable" \
  --region "$AWS_REGION"

echo ""
echo "Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/*" > /dev/null

echo ""
echo "Frontend deployed to $ENV: $SITE_URL"
