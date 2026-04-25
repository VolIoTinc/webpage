#!/bin/bash
# scripts/deploy-backend.sh
#
# Package backend/ Lambda functions and ship to AWS.
# Reads project identity from /project.config.json.
#
# Usage:
#   ./scripts/deploy-backend.sh [stage|prod]

set -e

ENV="${1:-stage}"
if [ "$ENV" != "stage" ] && [ "$ENV" != "prod" ]; then
  echo "Invalid environment. Use 'stage' or 'prod'"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$REPO_ROOT/project.config.json"

MERCHANT_NAME="$(jq -r .projectName "$CONFIG")"
AWS_REGION="$(jq -r '.awsRegion // "us-east-2"' "$CONFIG")"

echo "=============================================="
echo "  Deploying Backend to: $ENV"
echo "  Merchant: $MERCHANT_NAME"
echo "=============================================="

cd "$REPO_ROOT/backend"
[ -d node_modules ] || npm ci --production

echo "Packaging..."
rm -f functions.zip
zip -rq functions.zip functions/ node_modules/ package.json

FUNCTIONS=(
  "getProducts"
  "handleContact"
  "subscribe"
)

for func in "${FUNCTIONS[@]}"; do
  BASE_NAME="${MERCHANT_NAME}-${func}-${ENV}"
  FUNC_NAME=$(aws lambda list-functions --region "$AWS_REGION" \
    --query "Functions[?starts_with(FunctionName, \`${BASE_NAME}\`)].FunctionName" \
    --output text 2>/dev/null | head -1)

  if [ -z "$FUNC_NAME" ]; then
    echo "   WARNING: $BASE_NAME not found in AWS"
    continue
  fi

  echo "   Updating $FUNC_NAME..."
  aws lambda update-function-code \
    --function-name "$FUNC_NAME" \
    --zip-file fileb://functions.zip \
    --region "$AWS_REGION" \
    --no-cli-pager > /dev/null 2>&1 || echo "   ERROR: Failed to update $FUNC_NAME"
done

echo ""
echo "Backend deployed to $ENV"
