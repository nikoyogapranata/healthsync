import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes and their required roles
  const protectedRoutes = {
    "/superadmin-dashboard": ["superadmin"],
    "/admin-dashboard": ["admin", "superadmin"],
    "/director-dashboard": ["director", "superadmin"],
    "/doctor-dashboard": ["doctor", "superadmin"],
    "/dashboard": ["patient", "doctor", "admin", "director", "superadmin"],
    "/medical-records": ["patient", "doctor", "admin", "director", "superadmin"],
    "/appointments": ["patient", "doctor", "admin", "director", "superadmin"],
  }

  const currentPath = req.nextUrl.pathname

  // Check if the current path is protected
  const requiredRoles = protectedRoutes[currentPath as keyof typeof protectedRoutes]

  if (requiredRoles) {
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectTo", currentPath)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user role from database
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (error || !userData) {
      console.error("Error fetching user role:", error)
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check if user has required role
    if (!requiredRoles.includes(userData.role)) {
      // Redirect to appropriate dashboard based on user role
      let redirectPath = "/dashboard"
      switch (userData.role) {
        case "superadmin":
          redirectPath = "/superadmin-dashboard"
          break
        case "admin":
          redirectPath = "/admin-dashboard"
          break
        case "director":
          redirectPath = "/director-dashboard"
          break
        case "doctor":
          redirectPath = "/doctor-dashboard"
          break
        case "patient":
          redirectPath = "/dashboard"
          break
      }
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
  }

  // Handle redirect after login
  if (currentPath === "/login" && session) {
    const redirectTo = req.nextUrl.searchParams.get("redirectTo")

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }

    // Get user role and redirect to appropriate dashboard
    const { data: userData } = await supabase.from("users").select("role").eq("user_id", session.user.id).single()

    if (userData) {
      let redirectPath = "/dashboard"
      switch (userData.role) {
        case "superadmin":
          redirectPath = "/superadmin-dashboard"
          break
        case "admin":
          redirectPath = "/admin-dashboard"
          break
        case "director":
          redirectPath = "/director-dashboard"
          break
        case "doctor":
          redirectPath = "/doctor-dashboard"
          break
        case "patient":
          redirectPath = "/dashboard"
          break
      }
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    "/superadmin-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/director-dashboard/:path*",
    "/doctor-dashboard/:path*",
    "/dashboard/:path*",
    "/medical-records/:path*",
    "/appointments/:path*",
    "/login",
  ],
}
