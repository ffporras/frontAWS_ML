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
        const user = await getCurrentUser().catch(() => null)

        const username = idPayload?.["cognito:username"] || idPayload?.["email"] || user?.username || "user"
        const email = idPayload?.["email"] || ""
        const groups: string[] = (idPayload?.["cognito:groups"] as string[]) || []
        const role = groups.includes("superadmin") ? "superadmin" : "user"

        const user = {
          id: (idPayload?.["sub"] as string) || (user?.userId as string) || "",
          username,
          email,
          role,
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))

        router.replace("/browse")
      } catch (e) {
        console.error("OAuth callback error", e)
        router.replace("/")
      }
    }

    finalizeSignIn()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-foreground">Signing you in...</div>
    </div>
  )
}


