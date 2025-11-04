"use client"

import { Amplify } from "aws-amplify"

// Amplify v6 configuration (Cognito Hosted UI with PKCE)
(() => {
  const normalizeDomain = (d?: string) => {
    if (!d) return undefined
    return d.replace(/^https?:\/\//i, "")
  }

  const origin = typeof window !== "undefined" ? window.location.origin : undefined
  const redirectSignIn = [
    process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN as string,
    origin ? `${origin}/callback` : undefined,
  ].filter(Boolean) as string[]

  const redirectSignOut = [
    process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT as string,
    origin ? `${origin}/` : undefined,
  ].filter(Boolean) as string[]

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
        // identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID, // optional
        loginWith: {
          oauth: {
            domain: normalizeDomain(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
            scopes: ["openid", "email", "profile"],
            redirectSignIn,
            redirectSignOut,
            responseType: "code",
          },
        },
      },
    },
    ssr: true,
  })
})()

// Importing this module initializes Amplify on the client


