"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export function AuthGuard({ children, allowedRoles, fallbackPath = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push(fallbackPath)
          return
        }

        if (!allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard
          switch (user.role) {
            case "superadmin":
              router.push("/superadmin-dashboard")
              break
            case "admin":
              router.push("/admin-dashboard")
              break
            case "director":
              router.push("/director-dashboard")
              break
            case "doctor":
              router.push("/doctor-dashboard")
              break
            case "patient":
              router.push("/dashboard")
              break
            default:
              router.push("/dashboard")
          }
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(fallbackPath)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [allowedRoles, fallbackPath, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
