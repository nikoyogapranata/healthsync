"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export function EmailTroubleshoot() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    // Get Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setConfig({
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length || 0,
    })
  }, [])

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testEmailFlow = async () => {
    if (!email) return

    setIsLoading(true)
    setResults([])

    try {
      addResult("🔍 Starting email troubleshooting...")

      // Test 1: Basic signup
      addResult("📝 Testing basic signup...")
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: "testpassword123",
        options: {
          data: {
            test_user: true,
          },
        },
      })

      if (signupError) {
        addResult(`❌ Signup failed: ${signupError.message}`)
        return
      }

      if (signupData.user) {
        addResult(`✅ User created with ID: ${signupData.user.id}`)
        addResult(`📧 Email confirmed: ${signupData.user.email_confirmed_at ? "YES" : "NO"}`)
        addResult(`🔗 Confirmation sent: ${signupData.user.confirmation_sent_at ? "YES" : "NO"}`)

        if (signupData.session) {
          addResult("⚠️ User was auto-confirmed (email confirmations might be disabled)")
        } else {
          addResult("✅ User needs email confirmation (this is correct)")
        }
      }

      // Test 2: Password reset (alternative email test)
      addResult("🔄 Testing password reset email...")
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)

      if (resetError) {
        addResult(`❌ Password reset failed: ${resetError.message}`)
      } else {
        addResult("✅ Password reset email should be sent")
      }

      // Clean up test user
      if (signupData.user) {
        addResult("🧹 Cleaning up test user...")
        // Note: We can't delete users from client side, but they'll be cleaned up
      }
    } catch (err: any) {
      addResult(`❌ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Troubleshooting Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter test email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={testEmailFlow} disabled={isLoading || !email}>
                {isLoading ? "Testing..." : "Run Email Tests"}
              </Button>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Supabase Config</h4>
              <div className="space-y-1 text-sm">
                <div>
                  URL: <Badge variant="outline">{config?.url ? "✅ Set" : "❌ Missing"}</Badge>
                </div>
                <div>
                  Anon Key: <Badge variant="outline">{config?.hasKey ? "✅ Set" : "❌ Missing"}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What to Check in Supabase</h4>
              <ul className="text-sm space-y-1">
                <li>• Authentication → Settings</li>
                <li>• "Enable email confirmations" = ON</li>
                <li>• Site URL matches your domain</li>
                <li>• Email templates are enabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Quick Fix Steps:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Go to your Supabase Dashboard</li>
            <li>Authentication → Settings</li>
            <li>Enable "Enable email confirmations"</li>
            <li>
              Set Site URL to: <code>http://localhost:3000</code> (for development)
            </li>
            <li>
              Add Redirect URL: <code>http://localhost:3000/auth/callback</code>
            </li>
            <li>Save settings and try again</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  )
}
