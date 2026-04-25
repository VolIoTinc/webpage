# Merchant Bootstrap

A reusable AWS deployment template. Drop in your site in `webpage/`, your Lambda handlers in `backend/`, edit `project.config.json`, push, and you're live.

## What it does

- **Frontend hosting** — Next.js 14 static export → S3 + CloudFront (SSL via ACM, DNS via Route53)
- **Backend** — Lambda functions behind API Gateway v2 (HTTP), with DynamoDB + SES
- **Admin panel** — Cognito-gated Next.js dashboard + its own Lambdas (generic CRUD — useful once you have data to manage)
- **Infrastructure** — Pulumi (JavaScript), one program, two stacks (stage, prod)
- **CI/CD** — push to `stage` → stage env; push to `main` → prod

## Repo layout

```
project.config.json   # THE single source of project identity (name, domain, emails)
webpage/              # Public site (Next.js, static export)
backend/              # Public Lambda handlers
admin-webpage/        # Admin dashboard (Cognito-gated)
admin-backend/        # Admin Lambda handlers
infrastructure/       # Pulumi IaC
scripts/              # Manual deploy helpers
.github/workflows/    # CI/CD
```

## Using it on a new project

1. Clone or copy the repo to a new GitHub repo.
2. Edit `project.config.json` with the new project's name, domain, contact email, etc.
3. Edit `infrastructure/Pulumi.yaml`'s `name:` field so it matches `projectName` in `project.config.json` (Pulumi reads Pulumi.yaml before the program runs, so it's the one duplicate).
4. Run `scripts/setup-github.sh` — sets the 3 required GitHub secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `PULUMI_ACCESS_TOKEN`) via the `gh` CLI.
5. From `infrastructure/`: `npm ci && pulumi stack init stage && pulumi up --stack stage`.
6. Push to `stage` branch — CI deploys the public site and admin.
7. **Before the first merge to `main`**, initialize and deploy the prod stack locally: `pulumi stack init prod && pulumi up --stack prod`. The prod workflow on `main` runs `pulumi up --stack prod --yes`, which needs the stack to already exist (and its S3 buckets, CloudFront distributions, etc. to be created) — otherwise the frontend/backend deploy jobs run before infra and fail with `NoSuchBucket`.
8. Merge `stage` → `main` — CI deploys prod.

See `AWS_MANUAL_SETUP.md` for the one-time AWS prerequisites (Route53 zone, SES verification, first Cognito user).

## Deployment triggers

- Push to `stage` → `deploy-stage.yml` → stage environment.
- Push to `main` → `deploy-prod.yml` → production.
- Workflows detect which of `webpage/`, `backend/`, `admin-webpage/`, `admin-backend/`, `infrastructure/` or `project.config.json` changed and run only what's needed.

## How the config flows

`project.config.json` is read by:
- `infrastructure/config.js` — for AWS resource names, domains, emails in Lambda env
- `webpage/next.config.js` — inlined as `process.env.NEXT_PUBLIC_*` at build time
- `scripts/*.sh` — via `jq`
- `.github/workflows/*.yml` — via a "Read project config" job whose outputs are passed to every downstream job

Runtime values that only exist after a `pulumi up` (API Gateway URL, CloudFront distribution IDs, Cognito pool IDs) are pulled from Pulumi stack outputs by both the scripts and the CI — they don't need to be in GitHub secrets.
