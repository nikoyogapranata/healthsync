"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      // Check current session
      const { data: session, error: sessionError } = await supabase.auth.getSession()

      // Check users table
      const { data: users, error: usersError } = await supabase.from("users").select("*").limit(5)

      // Check patients table
      const { data: patients, error: patientsError } = await supabase.from("patients").select("*").limit(5)

      setDebugInfo({
        session: {
          data: session,
          error: sessionError,
        },
        users: {
          data: users,
          error: usersError,
        },
        patients: {
          data: patients,
          error: patientsError,
        },
      })
    } catch (err) {
      console.error("Debug error:", err)
      setDebugInfo({ error: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkAuthStatus} disabled={loading}>
            {loading ? "Loading..." : "Check Auth Status"}
          </Button>

          {debugInfo && (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
