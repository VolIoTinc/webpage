# AGENTS.md

## Project Overview

A reusable AWS deployment template. All per-project identity (name, domain, emails) lives in `/project.config.json`; the rest of the code is project-agnostic.

The monorepo has four deployable pieces plus infrastructure:

- **Public Frontend** (`webpage/`) — Next.js 14 static export → S3 + CloudFront
- **Public Backend** (`backend/`) — Lambda functions behind API Gateway v2
- **Admin Frontend** (`admin-webpage/`) — Next.js 14 with Cognito auth
- **Admin Backend** (`admin-backend/`) — admin Lambda functions
- **Infrastructure** (`infrastructure/`) — Pulumi (JavaScript)

Integrations baked in: AWS SES (email), SNS (SMS), DynamoDB (data + rate limits), Cognito (admin auth).

## Where values come from

`/project.config.json` is THE source of project identity — edit it and everything else reconfigures:

| Consumer | How it reads the config |
|---|---|
| `infrastructure/config.js` | `require("../project.config.json")` |
| `webpage/next.config.js` | `require("../project.config.json")`, exposed via Next.js `env` |
| `scripts/*.sh` | `jq` |
| `.github/workflows/*.yml` | `config` job reads it and exposes step outputs |

The Pulumi stack config files (`Pulumi.stage.yaml`, `Pulumi.prod.yaml`) only hold env-specific knobs (environment name, CloudFront price class, CORS origins). They use a fixed `bootstrap:` namespace so they never need per-project edits.

Runtime values (API Gateway URL, CloudFront distribution ID, Cognito IDs) come from `pulumi stack output` — both the deploy scripts and the CI workflows read them directly.

## Build / Lint / Test

### Frontend (`webpage/`)

```bash
npm ci
npm run dev
npm run build     # static export to out/
npm run lint
```

Build requires `NEXT_PUBLIC_API_URL` (Pulumi output) at build time. `NEXT_PUBLIC_SITE_URL` is derived from `rootDomain` + `ENV` in `next.config.js`.

### Backend (`backend/`)

```bash
npm ci --production
npm run zip
```

### Infrastructure (`infrastructure/`)

```bash
npm ci
pulumi up --stack stage
pulumi up --stack prod
```

### Manual deploy

```bash
scripts/deploy-backend.sh [stage|prod]
scripts/deploy-frontend.sh [stage|prod]
```

No env files to source — both scripts read `project.config.json` and `pulumi stack output` directly.

### CI/CD

Push to `stage` deploys stage; push to `main` deploys prod.

## Code Style

- JavaScript only (no TypeScript). Frontend has `jsconfig.json` with `@/*` path alias.
- 2-space indent, semicolons, double quotes.
- `camelCase` variables; `UPPER_SNAKE_CASE` constants; PascalCase for React components.
- CommonJS in Lambda handlers; ESM in Next.js.

### Lambda handler pattern

```js
// HTTP_METHOD /route - Description
const { success, error, parseBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") return success({});
    // business logic
    return success(data);
  } catch (err) {
    console.error("Context:", err);
    return error("User-facing message", 500);
  }
};
```

### Conventions

- Always use `success()`/`error()` from `utils.js` for Lambda responses.
- Always handle CORS preflight (`OPTIONS`) in handlers.
- Cache secrets (Secrets Manager) in module scope — fetch once per cold start.
- Frontend: `@/*` alias for local imports, never relative paths across layers.
- Environment variables are required, not optional — no hardcoded fallback values.
- Secrets Manager path convention: `{projectName}/{env}/{service}`.
