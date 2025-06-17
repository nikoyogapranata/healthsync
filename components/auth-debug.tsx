"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export function AuthDebug() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    setLoading(true)
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "testpassword123",
        options: {
          data: {
            full_name: "Test User",
            role: "patient",
          },
        },
      })

      setResult({
        success: !error,
        data: data,
        error: error?.message,
        hasSession: !!data.session,
        needsConfirmation: !data.session && !error,
      })
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAuthSettings = async () => {
    setLoading(true)
    try {
      // Try to get current session
      const { data: session } = await supabase.auth.getSession()

      // Check if we can access users table
      const { data: users, error: usersError } = await supabase.from("users").select("count").limit(1)

      setResult({
        currentSession: session.session?.user?.email || "None",
        canAccessUsers: !usersError,
        usersError: usersError?.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
    } catch (err: any) {
      setResult({
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testRegistration} disabled={loading}>
            Test Registration
          </Button>
          <Button onClick={checkAuthSettings} disabled={loading} variant="outline">
            Check Settings
          </Button>
        </div>

        {result && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  )
}
