"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/api"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await loginUser(username, password)

      if (user) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/browse")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Failed to login. Please try again.")
      console.error("Login error:", err)
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

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/75 rounded-lg p-12 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Sign In</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-muted border-border text-foreground h-12"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border-border text-foreground h-12"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Need help?
              </a>
            </div>
          </form>

          <div className="mt-8 text-muted-foreground">
            <span>New to MovieMatch? </span>
            <a href="#" className="text-foreground hover:underline font-semibold">
              Sign up now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
