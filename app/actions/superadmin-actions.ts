"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function fetchUserStats() {
  try {
    // Use admin client to bypass RLS and get all user data
    const { data: userData, error: userError } = await supabaseAdmin.from("users").select("role, created_at")

    if (userError) {
      console.error("Error fetching user data:", userError)
      throw userError
    }

    console.log("Fetched user data:", userData) // Debug log

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const totalUsers = userData?.length || 0
    const totalPatients = userData?.filter((u) => u.role === "patient").length || 0
    const totalDoctors = userData?.filter((u) => u.role === "doctor").length || 0
    const totalAdmins = userData?.filter((u) => u.role === "admin").length || 0
    const totalDirectors = userData?.filter((u) => u.role === "director").length || 0
    const recentRegistrations = userData?.filter((u) => new Date(u.created_at) > sevenDaysAgo).length || 0

    // Get facility count using admin client
    const { count: facilityCount, error: facilityError } = await supabaseAdmin
      .from("healthcare_facilities")
      .select("*", { count: "exact", head: true })

    if (facilityError) {
      console.error("Error fetching facility count:", facilityError)
    }

    const stats = {
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAdmins,
      totalDirectors,
      totalFacilities: facilityCount || 0,
      recentRegistrations,
      unverifiedUsers: 0,
    }

    console.log("Stats calculated:", stats) // Debug log

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error in fetchUserStats:", error)
    return { success: false, error: error.message }
  }
}

export async function fetchAllUsers() {
  try {
    // Use admin client to get all users
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from("users")
      .select(`
        user_id,
        email,
        role,
        created_at
      `)
      .order("created_at", { ascending: false })

    if (usersError) throw usersError

    return { success: true, data: usersData || [] }
  } catch (error) {
    console.error("Error in fetchAllUsers:", error)
    return { success: false, error: error.message }
  }
}
