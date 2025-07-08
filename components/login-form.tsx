//components\login-form.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for registration success message
    const registered = searchParams.get("registered")
    const message = searchParams.get("message")

    if (registered === "true" && message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login...")

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Auth error:", authError)

        // Provide specific error messages
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (authError.message.includes("Email not confirmed")) {
          setError(
            "Please check your email and click the verification link before signing in. Check your spam folder if you don't see the email.",
          )
        } else if (authError.message.includes("Too many requests")) {
          setError("Too many login attempts. Please wait a few minutes before trying again.")
        } else {
          setError(authError.message || "Login failed. Please try again.")
        }
        return
      }

      if (!authData.user) {
        setError("Login failed. Please try again.")
        return
      }

      // Check if email is verified
      if (!authData.user.email_confirmed_at) {
        setError("Please verify your email address before signing in. Check your inbox for the verification link.")
        return
      }

      console.log("Login successful, user:", authData.user.id)

      // Wait a moment for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Try to get user profile from database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, user_id, email")
        .eq("user_id", authData.user.id)
        .single()

      if (userError) {
        console.error("User data error:", userError)
        // If user doesn't exist in database, create them as patient
        const { error: insertError } = await supabase.from("users").insert({
          user_id: authData.user.id,
          email: authData.user.email,
          password: "managed_by_supabase_auth",
          role: "patient",
        })

        if (insertError) {
          console.error("Error creating user:", insertError)
          setError("Account setup incomplete. Please contact support.")
          return
        }

        // Default to patient dashboard
        router.push("/dashboard")
        return
      }

      console.log("User role:", userData.role)

      // Redirect based on user role
      switch (userData.role) {
        case "superadmin":
          console.log("Redirecting to superadmin dashboard")
          router.push("/superadmin-dashboard")
          break
        case "admin":
          console.log("Redirecting to admin dashboard")
          router.push("/admin-dashboard")
          break
        case "director":
          console.log("Redirecting to director dashboard")
          router.push("/director-dashboard")
          break
        case "doctor":
          console.log("Redirecting to doctor dashboard")
          router.push("/doctor-dashboard")
          break
        case "patient":
          console.log("Redirecting to patient dashboard")
          router.push("/dashboard")
          break
        default:
          console.log("Unknown role, redirecting to default dashboard")
          router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/register")}
            disabled={isLoading}
          >
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
