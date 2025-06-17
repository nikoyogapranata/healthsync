"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?error=Authentication failed")
          return
        }

        if (data.session?.user) {
          // User is now verified and authenticated
          const userId = data.session.user.id
          const userMetadata = data.session.user.user_metadata

          // Set up user profile in database
          await setupUserProfile(userId, userMetadata)

          // Redirect to dashboard
          router.push("/dashboard?verified=true")
        } else {
          router.push("/login?error=No session found")
        }
      } catch (err) {
        console.error("Callback handling error:", err)
        router.push("/login?error=Authentication failed")
      }
    }

    handleAuthCallback()
  }, [router])

  const setupUserProfile = async (userId: string, metadata: any) => {
    try {
      // Insert into users table
      const { error: userError } = await supabase.from("users").insert({
        user_id: userId,
        email: metadata.email || "",
        role: "patient",
        created_at: new Date().toISOString(),
      })

      if (userError && !userError.message.includes("duplicate")) {
        console.error("User creation error:", userError)
      }

      // Insert patient data
      const { error: patientError } = await supabase.from("patients").insert({
        patient_id: crypto.randomUUID(),
        user_id: userId,
        full_name: metadata.full_name || "",
        national_id: metadata.national_id || "",
        date_of_birth: metadata.date_of_birth || null,
        gender: metadata.gender || "",
        blood_type: metadata.blood_type || null,
        phone_number: metadata.phone_number || "",
        address: metadata.address || "",
      })

      if (patientError && !patientError.message.includes("duplicate")) {
        console.error("Patient creation error:", patientError)
      }
    } catch (err) {
      console.error("Profile setup error:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FB6F6] mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your account...</p>
      </div>
    </div>
  )
}
