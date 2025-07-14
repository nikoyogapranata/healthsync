// app/actions/regional-admin-actions.ts

'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Fetches all users within a specific province.
 * @param provinceId The ID of the province to filter by.
 */
export async function fetchAllUsers(provinceId: number) {
  const supabase = createClient()

  if (!provinceId) {
    return { success: false, error: 'Province ID is required.', data: null }
  }

  // Step 1: Get user_ids from all relevant profile tables within the province.
  // Note: This is more efficient than fetching all users and then filtering.
  const { data: patientUsers } = await supabase.from('patients').select('user_id').eq('province_id', provinceId)
  const { data: doctorUsers } = await supabase.from('doctors').select('user_id').eq('province_id', provinceId)

  // For admins and directors, we find them through their facility's province
  const { data: facilityStaff } = await supabase
    .from('healthcare_facilities')
    .select(`
      admins(user_id),
      directors(user_id)
    `)
    .eq('province_id', provinceId)

  const adminUsers = facilityStaff?.flatMap(f => f.admins.map(a => ({ user_id: a.user_id }))) || []
  const directorUsers = facilityStaff?.flatMap(f => f.directors.map(d => ({ user_id: d.user_id }))) || []
  
  // Also include the regional admin for the province
  const { data: regionalAdminUsers } = await supabase.from('regional_admins').select('user_id').eq('province_id', provinceId)


  // Step 2: Combine and deduplicate all user_ids.
  const allUserIds = [
    ...(patientUsers || []).map(u => u.user_id),
    ...(doctorUsers || []).map(u => u.user_id),
    ...adminUsers.map(u => u.user_id),
    ...directorUsers.map(u => u.user_id),
    ...(regionalAdminUsers || []).map(u => u.user_id),
  ]
  const uniqueUserIds = [...new Set(allUserIds.filter(id => id))]

  if (uniqueUserIds.length === 0) {
    return { success: true, data: [], error: null }
  }

  // Step 3: Fetch the main user data for the filtered IDs.
  const { data: users, error } = await supabase
    .from('users')
    .select('user_id, email, role, created_at')
    .in('user_id', uniqueUserIds)

  if (error) {
    console.error('Error fetching users by province:', error.message)
    return { success: false, error: 'Could not fetch user profiles.', data: null }
  }
  if (!users) {
    return { success: true, data: [], error: null }
  }

  // Step 4: Enrich the data with full names (this part remains the same).
  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const roleToTableMap: { [key: string]: string } = {
        patient: 'patients',
        doctor: 'doctors',
        admin: 'admins',
        director: 'directors',
        regional_admin: 'regional_admins',
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
 * Fetches system-wide statistics for a specific province.
 * @param provinceId The ID of the province to filter by.
 */
export async function fetchUserStats(provinceId: number) {
  const supabase = createClient()
  
  if (!provinceId) {
    return { success: false, error: 'Province ID is required.', data: null }
  }
  
  try {
    // We can reuse the user fetching logic from above to get the correct user list.
    const userResult = await fetchAllUsers(provinceId);
    if (!userResult.success || !userResult.data) {
        throw new Error(userResult.error || "Failed to fetch users for stats");
    }
    const usersInProvince = userResult.data;


    // Get the facility count for the specific province.
    const { count: totalFacilities, error: facilityError } = await supabase
      .from('healthcare_facilities')
      .select('*', { count: 'exact', head: true })
      .eq('province_id', provinceId)

    if (facilityError) {
      console.error("Error fetching facility count:", facilityError)
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Calculate stats based on the province-specific user list.
    const statsData = {
      totalUsers: usersInProvince.length,
      totalPatients: usersInProvince.filter((u) => u.role === 'patient').length,
      totalDoctors: usersInProvince.filter((u) => u.role === 'doctor').length,
      totalAdmins: usersInProvince.filter((u) => u.role === 'admin').length,
      totalDirectors: usersInProvince.filter((u) => u.role === 'director').length,
      recentRegistrations: usersInProvince.filter((u) => new Date(u.created_at) > sevenDaysAgo).length,
      totalFacilities: totalFacilities ?? 0,
      unverifiedUsers: 0, 
    }

    return { success: true, data: statsData, error: null }
  } catch (error: any) {
    console.error("Error in fetchUserStats:", error)
    return { success: false, data: null, error: error.message }
  }
}