"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const finalizeSignIn = async () => {
      try {
        // Ensure Amplify processes the OAuth code in the URL and tokens are available
        const { tokens } = await fetchAuthSession()
        const idPayload: Record<string, any> | undefined = tokens?.idToken?.payload as any

        // Fallback to getCurrentUser() for username/userId
        const cognitoUser = await getCurrentUser().catch(() => null)

        const username = idPayload?.["cognito:username"] || idPayload?.["email"] || cognitoUser?.username || "user"
        const email = idPayload?.["email"] || ""
        const groups: string[] = (idPayload?.["cognito:groups"] as string[]) || []
        const role = groups.includes("superadmin") ? "superadmin" : "user"

        const appUser = {
          id: (idPayload?.["sub"] as string) || (cognitoUser?.userId as string) || "",
          username,
          email,
          role,
        }

        if (appUser.id) {
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("currentUser", JSON.stringify(appUser))
          router.replace("/browse")
          return
        }

        // Fallback: no tokens/claims -> go home
        router.replace("/")
      } catch (e) {
        console.error("OAuth callback error", e)
        router.replace("/")
      }
    }

    // Run and also set a short timeout safety net
    finalizeSignIn()
    const t = setTimeout(() => {
      // if still on callback after 4s, go home
      router.replace("/")
    }, 4000)

    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-foreground">Signing you in...</div>
    </div>
  )
}


