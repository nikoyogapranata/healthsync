"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabaseClient"
import { Link } from "react-router-dom"

export function LoginCard() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [registrationMessage, setRegistrationMessage] = useState("")

  useEffect(() => {
    // Check for registration success message
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get("message")
    const registered = urlParams.get("registered")

    if (registered === "true" && message) {
      setRegistrationMessage(message)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login...")

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error("Login error:", error)

        // Provide specific error messages
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the verification link before signing in.")
        } else if (error.message.includes("Too many requests")) {
          setError("Too many login attempts. Please wait a few minutes before trying again.")
        } else {
          setError(error.message || "Login failed. Please try again.")
        }
        return
      }

      if (!data.user) {
        setError("Login failed. Please try again.")
        return
      }

      console.log("Login successful, checking user data...")

      // Get user role from database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("user_id", data.user.id)
        .single()

      if (userError) {
        console.error("User data error:", userError)
        setError("Account setup incomplete. Please contact support.")
        return
      }

      console.log("User role:", userData.role)

      // Redirect based on role
      const roleRedirects = {
        patient: "/dashboard",
        doctor: "/dashboard-dokter",
        admin: "/dashboard-admin",
        director: "/dashboard-direktur",
        superadmin: "/superadmin-dashboard",
      }

      const redirectPath = roleRedirects[userData.role as keyof typeof roleRedirects] || "/dashboard"
      console.log("Redirecting to:", redirectPath)

      window.location.href = redirectPath
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        {registrationMessage && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{registrationMessage}</AlertDescription>
          </Alert>
        )}
        <CardDescription>Enter your email and password to login</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {error && <Alert variant="destructive">{error}</Alert>}
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} onClick={handleSubmit} className="w-full">
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </CardFooter>
      <CardFooter className="justify-center">
        <Link to="/register" className="text-sm text-muted-foreground hover:underline">
          Don't have an account? Register
        </Link>
      </CardFooter>
    </Card>
  )
}
