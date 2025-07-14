import { supabase } from "./supabase"

export type UserRole = "superadmin"  | "regional_admin" | "admin" | "director" | "doctor" | "patient";


export interface User {
  id: string
  email: string
  role: UserRole
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("user_id, email, role")
      .eq("user_id", session.user.id)
      .single()

    if (error || !userData) {
      console.error("Error fetching user data:", error)
      return null
    }

    return {
      id: userData.user_id,
      email: userData.email,
      role: userData.role as UserRole,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "superadmin":
      return "/superadmin-dashboard"
    case "superadmin":
      return "/regional-admin-dashboard"
    case "admin":
      return "/admin-dashboard"
    case "director":
      return "/director-dashboard"
    case "doctor":
      return "/doctor-dashboard"
    case "patient":
      return "/dashboard"
    default:
      return "/dashboard"
  }
}
