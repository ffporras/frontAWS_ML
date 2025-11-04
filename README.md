# frontAWS_ML

## Auth setup (AWS Cognito Hosted UI)

Create a `.env.local` with the following variables (no secrets required):

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_73hkg
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=6hfsht70aqcefkbp6pssqt96qo
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1o0mkuqezd.auth.us-east-1.amazoncognito.com

# Replace TU-DOMINIO with your deployed domain
NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN=https://TU-DOMINIO/callback
NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT=https://TU-DOMINIO/
```

In your Cognito App Client, ensure:
- OAuth scopes: `openid`, `email`, `profile`
- Response type: `code`
- App Client is public (no client secret)
- Callback URL: `https://TU-DOMINIO/callback`
- Sign-out URL: `https://TU-DOMINIO/`

Install dependencies:

```
pnpm add aws-amplify
# or: npm i aws-amplify
```

Local dev tip: if running locally, set the redirect URLs to your local origin (e.g. `http://localhost:3000/callback` and `http://localhost:3000/`) in both Cognito and `.env.local`.
