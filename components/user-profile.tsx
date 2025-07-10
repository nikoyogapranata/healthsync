"use client"

import type React from "react"
import { useEffect, useState, useRef, type ChangeEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, type SubmitHandler } from "react-hook-form"

// Import Supabase Client & types
import { createClient } from "@/utils/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"

// Import komponen UI reusable
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Import Ikon
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplets,
  BadgeIcon as IdCard,
  Heart,
  Edit,
  ArrowLeft,
  Loader2,
  Home,
  FileText,
  MessageCircle,
  Settings,
  Camera,
  CheckCircle,
} from "lucide-react"

// Interface untuk data profil & form
export interface UserProfileData {
  userId: string
  fullName: string
  nationalId: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other"
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  address?: string
  profileImage?: string
  userRole?: string // Add this to track which table the user belongs to
}

type FormInputs = Omit<UserProfileData, "userId" | "email" | "nationalId" | "userRole">

// Komponen Header Terpisah dengan Profile Photo
function ProfileHeader({ user }: { user: UserProfileData | null }) {
  const getImageUrl = (profileImage: string | null | undefined) => {
    if (!profileImage) return null
    if (profileImage.startsWith("http")) return profileImage

    const supabase = createClient()
    const { data } = supabase.storage.from("avatars").getPublicUrl(profileImage)
    return data.publicUrl
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#3FB6F6]" />
            <h1 className="text-lg font-semibold text-gray-900">Patient Profile</h1>
          </div>
        </div>

        {/* Profile Photo di Header */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">HealthSync {user.userRole || 'User'}</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-[#3FB6F6]/20">
              <AvatarImage
                src={getImageUrl(user.profileImage) || "/placeholder.svg"}
                alt={user.fullName}
                key={Date.now()} // Force refresh
              />
              <AvatarFallback className="bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-sm font-semibold text-white">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  )
}

// Komponen Reusable Sidebar (tanpa active state untuk profile)
function AppSidebar({ dashboardPath }: { dashboardPath: string }) {
    const navigationItems = [
        { title: "Dashboard", url: dashboardPath, icon: Home },
        { title: "Appointments", url: "/appointments", icon: Calendar },
        { title: "Medical Records", url: "/patients-medical-records", icon: FileText },
        { title: "Ask AI", url: "/ask-ai", icon: MessageCircle },
        { title: "Settings", url: "/settings", icon: Settings },
    ]

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link
                href={dashboardPath} // UPDATED
                className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                  <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-lg text-foreground">HealthSync</span>
                  <span className="text-xs text-muted-foreground font-medium">Patient Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 rounded-lg font-medium transition-all duration-200",
                      "hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

// Komponen Utama Halaman Profil
export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageVersion, setImageVersion] = useState(0)
  const [dashboardPath, setDashboardPath] = useState("/dashboard") // ADDED: State for dynamic dashboard path
  const supabase = createClient()

  // Fungsi untuk mendapatkan URL gambar yang benar
  const getImageUrl = (profileImage: string | null | undefined) => {
    if (!profileImage) return null

    if (profileImage.startsWith("http")) {
      return `${profileImage}?v=${imageVersion}&t=${Date.now()}`
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(profileImage)
    return `${data.publicUrl}?v=${imageVersion}&t=${Date.now()}`
  }

  // ====================================================================
  // ===== FIXED FETCH USER PROFILE FUNCTION =====
  // ====================================================================
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        throw new Error("User not authenticated. Please log in.")
      }

      console.log("Authenticated user ID:", authUser.id)

      let userProfileData = null
      let userRole = null
      const tablesToTry = [
        { table: 'patients', role: 'Patient' },
        { table: 'doctors', role: 'Doctor' },
        { table: 'admins', role: 'Admin' },
        { table: 'directors', role: 'Director' }
      ]

      // Try to find user in each table
      for (const { table, role } of tablesToTry) {
        console.log(`Checking table: ${table}`)
        
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("user_id", authUser.id)
          .maybeSingle() // Use maybeSingle instead of single to avoid errors when no record found

        console.log(`Result from ${table}:`, { data, error })

        if (data && !error) {
          // Map the data to our interface
          userProfileData = {
            userId: authUser.id,
            fullName: data.full_name || data.name || 'Unknown',
            nationalId: data.national_id || data.nik || 'N/A',
            email: authUser.email || data.email || 'N/A',
            phoneNumber: data.phone_number || data.phone || 'N/A',
            dateOfBirth: data.date_of_birth || data.birth_date || '',
            gender: data.gender || 'Other',
            bloodType: data.blood_type || undefined,
            address: data.address || undefined,
            profileImage: data.profile_picture || data.avatar_url || data.photo || undefined,
            userRole: role
          }
          userRole = role
          console.log(`Found user in ${table} table as ${role}`)
          break
        }
      }

      if (!userProfileData) {
        throw new Error("Profile not found in any table. Please contact support.")
      }

      console.log("Final user profile data:", userProfileData)
      setUser(userProfileData as UserProfileData)
      setImageVersion((prev) => prev + 1)
      
    } catch (err: any) {
      console.error("Error fetching user profile:", err)
      setError(err.message || "Failed to fetch profile data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])
  
  // ADDED: useEffect to set dashboard path based on user role
  useEffect(() => {
    if (user?.userRole) {
      switch (user.userRole.toLowerCase()) {
        case 'doctor':
          setDashboardPath('/doctor-dashboard'); // Or your actual doctor dashboard path
          break;
        case 'admin':
          setDashboardPath('/dashboard-admin'); // Or your actual admin dashboard path
          break;
        case 'director':
            setDashboardPath('dashboard-direktur'); // Or your actual director dashboard path
            break;
        case 'patient':
        default:
          setDashboardPath('/dashboard'); // Default for patients
          break;
      }
    }
  }, [user]); // This effect runs whenever the 'user' object changes

  // Helper Functions
  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Tampilan Loading
  if (loading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3FB6F6]" />
        <p className="ml-4 text-lg">Loading Profile...</p>
      </div>
    )
  }

  // Tampilan Error
  if (error || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-red-600">
        <p className="text-lg mb-4">Error: {error || "Could not load user profile."}</p>
        <Button onClick={fetchUserProfile} className="bg-[#3FB6F6] hover:bg-[#34D399]">
          Try Again
        </Button>
      </div>
    )
  }

  const imageUrl = getImageUrl(user.profileImage)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SidebarProvider>
        {/* UPDATED: Pass dashboardPath as a prop */}
        <AppSidebar dashboardPath={dashboardPath} />
        <SidebarInset className="flex flex-1 flex-col">
          {/* Header dengan Profile Photo */}
          <ProfileHeader user={user} />

          <main className="flex-1">
            {/* Navigation Bar */}
            <div className="border-b border-gray-200 bg-white">
              <div className="mx-auto max-w-6xl px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* UPDATED: Link uses dynamic dashboardPath */}
                  <Link
                    href={dashboardPath} 
                    className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-[#3FB6F6]"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Back to Dashboard</span>
                  </Link>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-gradient-to-r from-[#3FB6F6] to-[#34D399] px-6 text-white hover:from-[#34D399] hover:to-[#3FB6F6]"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-6xl space-y-6 p-6">
              {/* Profile Card */}
              <Card className="border-l-4 border-l-[#3FB6F6] bg-white shadow-sm">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <Avatar className="h-24 w-24 border-4 border-[#3FB6F6]/20">
                      <AvatarImage
                        src={imageUrl || "/placeholder.svg"}
                        alt={user.fullName}
                        key={`${imageVersion}-${Date.now()}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-xl font-semibold text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-gray-900">{user.fullName}</h3>
                      <div className="flex items-center justify-center gap-2 font-medium text-[#3FB6F6]">
                        <Heart className="h-4 w-4" />
                        <span>HealthSync {user.userRole || 'User'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information Card */}
              <Card className="border-l-4 border-l-[#34D399] bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <User className="h-5 w-5 text-[#34D399]" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <InfoItem
                        icon={<IdCard className="w-5 h-5 text-gray-600" />}
                        label="National ID (NIK)"
                        value={user.nationalId}
                        isMonospace
                      />
                      <InfoItem
                        icon={<Calendar className="w-5 h-5 text-gray-600" />}
                        label="Date of Birth"
                        value={formatDate(user.dateOfBirth)}
                      />
                    </div>
                    <div className="space-y-6">
                      <InfoItem icon={<User className="w-5 h-5 text-gray-600" />} label="Gender">
                        <Badge variant="outline" className="border-[#3FB6F6] bg-[#3FB6F6]/5 font-medium text-[#3FB6F6]">
                          {user.gender}
                        </Badge>
                      </InfoItem>
                      {user.bloodType && (
                        <InfoItem icon={<Droplets className="w-5 h-5 text-gray-600" />} label="Blood Type">
                          <Badge className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] font-medium text-white">
                            {user.bloodType}
                          </Badge>
                        </InfoItem>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card className="border-l-4 border-l-[#3FB6F6] bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <Mail className="h-5 w-5 text-[#3FB6F6]" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <InfoItem
                      icon={<Mail className="w-5 h-5 text-gray-600" />}
                      label="Email Address"
                      value={user.email}
                    />
                    <InfoItem
                      icon={<Phone className="w-5 h-5 text-gray-600" />}
                      label="Phone Number"
                      value={user.phoneNumber}
                    />
                  </div>
                  {user.address && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 text-sm font-medium text-gray-500">Address</p>
                          <p className="leading-relaxed text-gray-900">{user.address}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* Modal untuk Edit Profil */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        supabase={supabase}
        onSaveSuccess={fetchUserProfile}
      />
    </div>
  )
}

// Komponen Modal Edit Profil
function EditProfileModal({
  isOpen,
  onClose,
  user,
  supabase,
  onSaveSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  user: UserProfileData
  supabase: SupabaseClient
  onSaveSuccess: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      bloodType: user.bloodType,
      address: user.address,
    },
  })
  const [previewImage, setPreviewImage] = useState<string | null>(user.profileImage || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Please select an image smaller than 5MB.")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Invalid file type. Please select a valid image file.")
        return
      }

      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      let newImageUrl = user.profileImage

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop()
        const fileName = `profile-${Date.now()}.${fileExt}`
        const filePath = `${user.userId}/${fileName}`

        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
        newImageUrl = urlData.publicUrl

        if (user.profileImage && user.profileImage !== newImageUrl) {
          try {
            const oldPath = user.profileImage.includes("/avatars/")
              ? user.profileImage.split("/avatars/")[1].split("?")[0]
              : user.profileImage

            if (oldPath && oldPath !== filePath) {
              await supabase.storage.from("avatars").remove([oldPath])
            }
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError)
          }
        }
      }

      // Determine which table to update based on user role
      const roleToTableMap: Record<string, string> = {
        'Patient': 'patients',
        'Doctor': 'doctors',
        'Admin': 'admins',
        'Director': 'directors'
      }

      const tableName = roleToTableMap[user.userRole || 'Patient'] || 'patients'

      const { error: updateError } = await supabase
        .from(tableName)
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          blood_type: data.bloodType,
          address: data.address,
          profile_picture: newImageUrl,
        })
        .eq("user_id", user.userId)

      if (updateError) throw new Error(`Database update failed: ${updateError.message}`)

      alert("Profile updated successfully!")
      onSaveSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      alert(`Failed to update profile: ${error.message}`)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-[#3FB6F6]" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-[#3FB6F6]/20">
                <AvatarImage src={previewImage || "/placeholder.svg"} alt="Profile Preview" />
                <AvatarFallback className="bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-xl font-semibold text-white">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-[#3FB6F6] hover:bg-[#34D399] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
            <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: "Full name is required" })}
                className="focus:ring-[#3FB6F6] focus:border-[#3FB6F6]"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className="focus:ring-[#3FB6F6] focus:border-[#3FB6F6]"
                placeholder="e.g., +62 812 3456 7890"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="focus:ring-[#3FB6F6] focus:border-[#3FB6F6]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                {...register("gender")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-[#3FB6F6] focus:border-[#3FB6F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select
                id="bloodType"
                {...register("bloodType")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-[#3FB6F6] focus:border-[#3FB6F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                className="focus:ring-[#3FB6F6] focus:border-[#3FB6F6]"
                placeholder="Enter your full address"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#34D399] hover:to-[#3FB6F6]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Komponen kecil untuk menampilkan item informasi
function InfoItem({
  icon,
  label,
  value,
  isMonospace = false,
  children,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  isMonospace?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">{icon}</div>
      <div className="flex-1">
        <p className="mb-1 text-sm font-medium text-gray-500">{label}</p>
        {value && <p className={cn("text-lg text-gray-900 break-words", isMonospace && "font-mono")}>{value}</p>}
        {children}
      </div>
    </div>
  )
}