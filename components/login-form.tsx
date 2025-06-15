"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for registration success message
    if (searchParams.get("registered") === "true") {
      const message =
        searchParams.get("message") || "Registration successful! Please check your email to verify your account."
      setSuccessMessage(message)
    }
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! You can now sign in.")
    }
  }, [searchParams])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    let authData = null // Declare authData here

    try {
      console.log("Attempting login with:", { email })

      // Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      authData = data

      console.log("Auth response:", { authData, authError })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("No user data returned")
      }

      console.log("User authenticated:", authData.user.id)

      // Check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single()

      console.log("User data query:", { userData, userError })

      if (userError) {
        console.error("User data fetch error:", userError)

        // If user doesn't exist in users table, create it
        if (userError.code === "PGRST116") {
          // No rows returned
          console.log("User not found in database, creating...")

          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              user_id: authData.user.id,
              email: authData.user.email,
              role: "patient",
              created_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            console.error("User creation error:", createError)
            setDebugInfo(`Debug: User creation failed - ${createError.message}`)
            throw new Error("Failed to create user profile")
          }

          console.log("User created:", newUser)

          // Also create patient record if it doesn't exist
          const { error: patientError } = await supabase.from("patients").insert({
            patient_id: crypto.randomUUID(),
            user_id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || "",
            national_id: authData.user.user_metadata?.national_id || "",
            date_of_birth: authData.user.user_metadata?.date_of_birth || null,
            gender: authData.user.user_metadata?.gender || "",
            blood_type: authData.user.user_metadata?.blood_type || null,
            phone_number: authData.user.user_metadata?.phone_number || "",
            address: authData.user.user_metadata?.address || "",
          })

          if (patientError && !patientError.message.includes("duplicate")) {
            console.error("Patient creation error:", patientError)
          }

          // Use the newly created user data
          const userData = newUser
        } else {
          throw new Error("Failed to fetch user profile")
        }
      }

      // Redirect based on role
      const role = userData.role || "patient"
      console.log("Redirecting user with role:", role)

      switch (role) {
        case "patient":
          router.push("/dashboard")
          break
        case "doctor":
          router.push("/doctor-dashboard")
          break
        case "admin":
          router.push("/admin-dashboard")
          break
        case "director":
          router.push("/director-dashboard")
          break
        default:
          router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid login credentials")
      setDebugInfo(`Debug: ${err.message} | Auth User ID: ${authData?.user?.id || "N/A"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to HealthSync</h1>
        <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertDescription className="text-xs font-mono">{debugInfo}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#3FB6F6] hover:text-[#34D399]">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-[#3FB6F6] hover:text-[#34D399]">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
