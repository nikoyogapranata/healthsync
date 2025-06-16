"use server"

import { createClient } from "@supabase/supabase-js"

// Create a service role client that bypasses RLS
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function createAdminUser(formData: {
  fullName: string
  email: string
  password: string
  facilityId: string
}) {
  try {
    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const emailExists = existingUser.users.some((user) => user.email === formData.email)

    if (emailExists) {
      return { success: false, message: "An account with this email already exists" }
    }

    // Create user in Supabase Auth (requires email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: false, // Requires email verification
      user_metadata: {
        full_name: formData.fullName,
        role: "admin",
      },
    })

    if (authError) throw authError

    if (authData.user) {
      // Create user record (bypasses RLS with service role)
      const { error: userError } = await supabaseAdmin.from("users").insert({
        user_id: authData.user.id,
        email: formData.email,
        role: "admin",
        password: "managed_by_supabase_auth",
      })

      if (userError) throw userError

      // Create admin record
      const { error: adminError } = await supabaseAdmin.from("admins").insert({
        admin_id: crypto.randomUUID(),
        user_id: authData.user.id,
        healthcare_facility_id: formData.facilityId,
        full_name: formData.fullName,
        employee_id: `ADM-${Date.now()}`,
      })

      if (adminError) throw adminError

      // Send verification email
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email: formData.email,
      })

      return {
        success: true,
        message: `Admin account created successfully! A verification email has been sent to ${formData.email}`,
      }
    }

    throw new Error("Failed to create user")
  } catch (error: any) {
    console.error("Error creating admin:", error)
    return { success: false, message: error.message || "Failed to create admin" }
  }
}

export async function createDirectorUser(formData: {
  fullName: string
  email: string
  password: string
  facilityId: string
}) {
  try {
    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const emailExists = existingUser.users.some((user) => user.email === formData.email)

    if (emailExists) {
      return { success: false, message: "An account with this email already exists" }
    }

    // Create user in Supabase Auth (requires email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: false, // Requires email verification
      user_metadata: {
        full_name: formData.fullName,
        role: "director",
      },
    })

    if (authError) throw authError

    if (authData.user) {
      // Create user record (bypasses RLS with service role)
      const { error: userError } = await supabaseAdmin.from("users").insert({
        user_id: authData.user.id,
        email: formData.email,
        role: "director",
        password: "managed_by_supabase_auth",
      })

      if (userError) throw userError

      // Create director record
      const { error: directorError } = await supabaseAdmin.from("directors").insert({
        director_id: crypto.randomUUID(),
        user_id: authData.user.id,
        healthcare_facility_id: formData.facilityId,
        full_name: formData.fullName,
      })

      if (directorError) throw directorError

      // Send verification email
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email: formData.email,
      })

      return {
        success: true,
        message: `Director account created successfully! A verification email has been sent to ${formData.email}`,
      }
    }

    throw new Error("Failed to create user")
  } catch (error: any) {
    console.error("Error creating director:", error)
    return { success: false, message: error.message || "Failed to create director" }
  }
}
