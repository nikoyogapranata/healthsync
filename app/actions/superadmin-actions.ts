//app\actions\superadmin-actions.ts

'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Fetches all users that exist in the public.users table and enriches
 * them with their full name from profile tables.
 */
export async function fetchAllUsers() {
  const supabase = createClient()

  // Use public.users as the single source of truth
  const { data: users, error } = await supabase
    .from('users')
    .select('user_id, email, role, created_at')

  if (error) {
    console.error('Error fetching users:', error.message)
    return { success: false, error: 'Could not fetch user profiles.', data: null }
  }
  if (!users) {
    return { success: true, data: [], error: null }
  }

  // Enrich the data with full names
  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const roleToTableMap: { [key: string]: string } = {
        patient: 'patients',
        doctor: 'doctors',
        admin: 'admins',
        director: 'directors',
      }
      const tableName = roleToTableMap[user.role]
      let profileData: any = {}

      if (tableName) {
        const { data } = await supabase
          .from(tableName)
          .select('full_name, active_status')
          .eq('user_id', user.user_id)
          .single()
        profileData = data || {}
      }
      
      return {
        ...user,
        full_name: profileData.full_name || 'N/A',
        active_status: profileData.active_status ?? true,
      }
    })
  )

  return { success: true, data: enrichedUsers, error: null }
}

/**
 * Fetches system-wide statistics based ONLY on the public.users table.
 */
export async function fetchUserStats() {
  const supabase = createClient()

  try {
    // Step 1: Get all users from the public.users table ONLY.
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role, created_at')

    if (usersError) {
      throw usersError
    }
    if (!users) {
      // Return zeroed-out stats if there are no users
      return { 
          success: true, 
          data: { totalUsers: 0, totalPatients: 0, totalDoctors: 0, totalAdmins: 0, totalDirectors: 0, totalFacilities: 0, recentRegistrations: 0, unverifiedUsers: 0 }, 
          error: null 
      };
    }

    // Step 2: Get the facility count.
    const { count: totalFacilities, error: facilityError } = await supabase
      .from('healthcare_facilities')
      .select('*', { count: 'exact', head: true })

    if (facilityError) {
      console.error("Error fetching facility count:", facilityError)
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Step 3: Calculate all stats from the single `users` list.
    const statsData = {
      totalUsers: users.length,
      totalPatients: users.filter((u) => u.role === 'patient').length,
      totalDoctors: users.filter((u) => u.role === 'doctor').length,
      totalAdmins: users.filter((u) => u.role === 'admin').length,
      totalDirectors: users.filter((u) => u.role === 'director').length,
      recentRegistrations: users.filter((u) => new Date(u.created_at) > sevenDaysAgo).length,
      totalFacilities: totalFacilities ?? 0,
      unverifiedUsers: 0, // Cannot get this without querying auth.users
    }

    return { success: true, data: statsData, error: null }
  } catch (error: any) {
    console.error("Error in fetchUserStats:", error)
    return { success: false, data: null, error: error.message }
  }
}