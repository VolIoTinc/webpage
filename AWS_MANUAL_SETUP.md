# AWS Manual Setup

One-time AWS setup that Pulumi can't do on its own. All commands read your project's config from `/project.config.json`.

## Prerequisites

- AWS account with admin access
- Route53 hosted zone for the domain in `project.config.json` `rootDomain`
- Pulumi CLI (`curl -fsSL https://get.pulumi.com | sh`)
- `jq` for reading the config from shell

## 1. Verify SES sending domain

```bash
ROOT=$(jq -r .rootDomain project.config.json)
REGION=$(jq -r '.awsRegion // "us-east-2"' project.config.json)
aws ses verify-domain-identity --domain "$ROOT" --region "$REGION"
```

Publish the DNS records shown on the SES domain identity page to complete verification.

## 2. Deploy infrastructure

```bash
cd infrastructure
npm ci
pulumi stack init stage    # first time only
pulumi up --stack stage
```

Stack outputs include API Gateway URLs, CloudFront distribution IDs, and Cognito pool/client IDs. CI reads them directly, so you usually don't need to copy them anywhere — but `pulumi stack output` is useful for local scripts.

## 3. Create the first admin user (optional)

Only if you plan to use `admin-webpage/`:

```bash
POOL=$(cd infrastructure && pulumi stack output --stack stage cognitoUserPoolId)
CONTACT=$(jq -r .contactEmail project.config.json)
aws cognito-idp admin-create-user \
  --user-pool-id "$POOL" \
  --username admin \
  --user-attributes Name=email,Value="$CONTACT" \
  --temporary-password "TempPass123!"
```

The admin is prompted to set a new password and configure MFA on first login.

## 4. SNS SMS sandbox + spend cap (only if you set `smsNumber`)

If `project.config.json` has a `smsNumber`, the `/contact` Lambda will SMS-page that
number whenever a form is submitted. New AWS accounts start in the **SMS sandbox** —
only verified destination numbers can receive messages.

### Verify the destination number

Open SNS → "Mobile" → "Phone numbers (SMS sandbox)" → "Add phone number". Enter the value
of `smsNumber` and confirm the OTP. Repeat for any test numbers.

To leave the sandbox (so any customer-entered number could receive — not used by the
default contact form, which only sends TO the office), open a Service Quotas case for
"Exit SMS sandbox".

### Set the monthly spend cap (this is the bankruptcy fuse)

SNS → "Mobile" → "Text messaging preferences" → set **Account spend limit** to a small
dollar amount (e.g. `$20`). AWS hard-stops sending past this number — your worst-case bill
from a contact-form abuse incident is whatever you set.

Default cap on new accounts is `$1`, which will silently drop legit messages once it's hit.
Bump it once you're live.

### (Optional) WAF rate-based rule on the API Gateway

For an additional bot-flood layer before requests hit Lambda, attach a WAF web ACL to the
API Gateway with a rate-based rule (e.g. 50 requests / 5 min per source IP). Set
`bootstrap:wafAclArn` in the Pulumi stack config to associate it. ~$5/month per ACL.

The Lambda already enforces a 5/day limit per IP, phone, and email via the
`{projectName}-RateLimits-{env}` DynamoDB table. WAF is an optional second layer.

## 5. GitHub Secrets

Only three are required — everything else is derived from `project.config.json` or Pulumi outputs at CI time:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PULUMI_ACCESS_TOKEN`

Run `scripts/setup-github.sh` to set them interactively via the `gh` CLI — it auto-detects the repo from your git remote and reads project identity from `project.config.json`.
