"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type HeaderProps = {
  pageTitle: string
}

// --- Helper function to get user initials ---
function getInitials(name: string): string {
  if (!name) return ""
  const names = name.split(" ")
  const firstInitial = names[0]?.[0] || ""
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : ""
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

export function Header({ pageTitle }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  // State to hold user data and loading status
  const [userData, setUserData] = useState<{
    fullName: string
    email: string
    initials: string
    profileImage?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to get image URL
  const getImageUrl = (profileImage: string | null | undefined) => {
    if (!profileImage) return null
    if (profileImage.startsWith("http")) return profileImage

    const { data } = supabase.storage.from("avatars").getPublicUrl(profileImage)
    return data.publicUrl
  }

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Get user from the session
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // 2. Function to find the user's full name and profile image from different profile tables
        const getUserProfile = async (userId: string) => {
          const tablesToTry = [
            { table: "patients", nameField: "full_name", imageField: "profile_picture" },
            { table: "doctors", nameField: "full_name", imageField: "profile_picture" },
            { table: "admins", nameField: "full_name", imageField: "profile_picture" },
            { table: "directors", nameField: "full_name", imageField: "profile_picture" },
          ]

          for (const { table, nameField, imageField } of tablesToTry) {
            const { data, error } = await supabase
              .from(table)
              .select(`${nameField}, ${imageField}`)
              .eq("user_id", userId)
              .single()

            if (data?.[nameField]) {
              return {
                fullName: data[nameField],
                profileImage: data[imageField] || null,
              }
            }
          }
          return {
            fullName: user.email || "User",
            profileImage: null,
          }
        }

        const profile = await getUserProfile(user.id)
        const initials = getInitials(profile.fullName)

        setUserData({
          fullName: profile.fullName,
          email: user.email || "",
          initials,
          profileImage: profile.profileImage,
        })
      }
      setLoading(false)
    }

    fetchUserData()

    // Set up real-time subscription to listen for profile updates
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "patients",
        },
        () => {
          // Refetch user data when profile is updated
          fetchUserData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // --- Sign Out Functionality ---
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh() // Ensure a clean state after logout
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:bg-accent/50 transition-colors"
            >
              {loading ? (
                <Skeleton className="size-10 rounded-full" />
              ) : (
                <Avatar className="h-10 w-10 border-2 border-[#3FB6F6]/20">
                  <AvatarImage
                    src={getImageUrl(userData?.profileImage) || "/placeholder.svg"}
                    alt={userData?.fullName || "User"}
                    key={Date.now()} // Force refresh when image changes
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white font-semibold text-sm">
                    {userData?.initials || "..."}
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userData && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="hover:bg-accent/50 cursor-pointer">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-accent/50 cursor-pointer">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-accent/50 text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
