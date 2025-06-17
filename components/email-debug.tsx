"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function EmailDebug() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")

  const testEmailSending = async () => {
    setIsLoading(true)
    setResult("")

    try {
      // Test sending a password reset email (this will show if email is working)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })

      if (error) {
        setResult(`❌ Email Error: ${error.message}`)
      } else {
        setResult(`✅ Email sent successfully! Check your inbox.`)
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Email Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={testEmailSending} disabled={isLoading || !email}>
            {isLoading ? "Testing..." : "Test Email Sending"}
          </Button>
        </div>

        {result && (
          <Alert variant={result.includes("✅") ? "default" : "destructive"}>
            <AlertDescription>{result}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>What to check in Supabase:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Authentication → Settings → Enable email confirmations</li>
            <li>Authentication → Settings → SMTP settings configured</li>
            <li>Authentication → Email Templates → Confirm signup template</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
