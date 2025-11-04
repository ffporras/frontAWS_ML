"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signInWithRedirect } from "aws-amplify/auth"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleHostedUILogin = async () => {
    try {
      setLoading(true)
      await signInWithRedirect()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=cinematic+movie+theater+background)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Login CTA */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/75 rounded-lg p-12 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Sign In</h1>

          <div className="space-y-6">
            <Button
              onClick={handleHostedUILogin}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
              disabled={loading}
            >
              {loading ? "Redirecting..." : "Sign in with Cognito"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
