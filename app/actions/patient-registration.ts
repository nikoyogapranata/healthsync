"use server"

import { createClient } from "@supabase/supabase-js"

// Create a service role client that bypasses RLS
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Create a regular client for auth operations
const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function registerPatient(formData: {
  fullName: string
  email: string
  password: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  address?: string
}) {
  try {
    console.log("Starting patient registration...")

    // Step 0: Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("email", formData.email)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists. Please use a different email or try logging in.",
      }
    }

    // Step 1: Use regular signup (this will send verification email automatically)
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: "patient",
        },
      },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { success: false, message: authError.message }
    }

    if (!authData.user) {
      return { success: false, message: "Failed to create user account" }
    }

    console.log("User created in Auth, adding to database...")

    // Step 2: Add user to users table using admin client (bypasses RLS)
    const { error: userError } = await supabaseAdmin.from("users").insert({
      user_id: authData.user.id,
      email: formData.email,
      password: "managed_by_supabase_auth",
      role: "patient",
    })

    if (userError) {
      console.error("User table error:", userError)
      // Clean up auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: `Failed to create user record: ${userError.message}` }
    }

    // Step 3: Add patient details
    const patientData: any = {
      patient_id: crypto.randomUUID(),
      user_id: authData.user.id,
      full_name: formData.fullName,
      phone_number: formData.phoneNumber || null,
      gender: formData.gender || null,
      blood_type: formData.bloodType || null,
      address: formData.address || null,
    }

    // Only add date_of_birth if it's provided and valid
    if (formData.dateOfBirth && formData.dateOfBirth.trim() !== "") {
      patientData.date_of_birth = formData.dateOfBirth
    }

    const { error: patientError } = await supabaseAdmin.from("patients").insert(patientData)

    if (patientError) {
      console.error("Patient table error:", patientError)
      // Clean up both auth user and users table
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabaseAdmin.from("users").delete().eq("user_id", authData.user.id)
      return { success: false, message: `Failed to create patient profile: ${patientError.message}` }
    }

    console.log("Patient registration successful!")
    return {
      success: true,
      message: "Registration successful! Please check your email and click the verification link before signing in.",
      requiresVerification: true,
    }
  } catch (err: any) {
    console.error("Registration error:", err)
    return { success: false, message: err.message || "An unexpected error occurred" }
  }
}
