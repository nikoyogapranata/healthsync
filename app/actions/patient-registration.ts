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

// 1. Update the function's parameter type to match the new form data
export async function registerPatient(formData: {
  fullName: string
  email: string
  password: string
  national_id: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  province_id?: string
  regency_id?: string
  district_id?: string
  street_address?: string
}) {
  try {
    console.log("Starting patient registration...")

    // Step 1: Check if email already exists in the users table
    const { data: existingUserByEmail } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("email", formData.email)
      .single()

    if (existingUserByEmail) {
      return {
        success: false,
        message: "An account with this email already exists. Please use a different email or try logging in.",
      }
    }

    // Step 2: Check if National ID already exists in the patients table
    const { data: existingPatientById } = await supabaseAdmin
      .from("patients")
      .select("national_id")
      .eq("national_id", formData.national_id)
      .single()

    if (existingPatientById) {
      return {
        success: false,
        message: "A patient with this National ID is already registered. Please check the ID and try again.",
      }
    }

    // Step 3: Use regular signup (this will send verification email automatically)
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

    // Step 4: Add user to users table using admin client (bypasses RLS)
    const { error: userError } = await supabaseAdmin.from("users").insert({
      user_id: authData.user.id,
      email: formData.email,
      password: "managed_by_supabase_auth", // It's better not to store plaintext passwords
      role: "patient",
    })

    if (userError) {
      console.error("User table error:", userError)
      // Clean up auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: `Failed to create user record: ${userError.message}` }
    }

    // 2. Update the patientData object to use the new structured address fields
    const patientData: any = {
      patient_id: crypto.randomUUID(),
      user_id: authData.user.id,
      full_name: formData.fullName,
      national_id: formData.national_id,
      phone_number: formData.phoneNumber || null,
      gender: formData.gender || null,
      blood_type: formData.bloodType || null,
      // 3. Convert string IDs to numbers and handle optional fields
      province_id: formData.province_id ? parseInt(formData.province_id, 10) : null,
      regency_id: formData.regency_id ? parseInt(formData.regency_id, 10) : null,
      district_id: formData.district_id ? parseInt(formData.district_id, 10) : null,
      street_address: formData.street_address || null,
    }

    // Only add date_of_birth if it's provided and valid
    if (formData.dateOfBirth && formData.dateOfBirth.trim() !== "") {
      patientData.date_of_birth = formData.dateOfBirth
    }

    const { error: patientError } = await supabaseAdmin.from("patients").insert(patientData)

    if (patientError) {
      console.error("Patient table error:", patientError)
      // Clean up both auth user and users table entries
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
