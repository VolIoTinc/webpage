To test locally:

Dev server runs on port 3001 (npm run dev). To test locally you'll need a .env.local with:
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2\*[pool ID]
NEXT_PUBLIC_COGNITO_CLIENT_ID=<your client id>
NEXT_PUBLIC_ADMIN_API_URL=https://[admin-api-gateway-ID].execute-api.us-east-2.amazonaws.com

Next steps to get this live:

1. Create Cognito users (you + mechant) in the us-east-2\_[pool ID] pool
2. Set the GitHub secrets for stage (STAGE_ADMIN_API_URL, STAGE_COGNITO_USER_POOL_ID, STAGE_COGNITO_CLIENT_ID, STAGE_ADMIN_CF_DIST_ID)
3. npm install in admin-backend to generate package-lock.json, then push to stage branch
4. The CI/CD will deploy both the Lambdas and the static site
