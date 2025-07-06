import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import Link from "next/link"

export interface UserProfile {
  fullName: string
  nationalId: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other"
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  address?: string
  profileImage?: string
}

interface UserProfileProps {
  user: UserProfile
}

export default function UserProfile({ user }: UserProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Centered Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
          <p className="text-gray-600">Complete healthcare profile information</p>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-[#3FB6F6] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>

              <div>
                <h2 className="text-xl font-bold text-gray-900">Patient Profile</h2>
                <p className="text-sm text-gray-600">Manage your personal information</p>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#34D399] hover:to-[#3FB6F6] text-white gap-2 px-6">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-l-4 border-l-[#3FB6F6] bg-white shadow-sm">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-[#3FB6F6]/20">
                <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white text-xl font-semibold">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.fullName}</h3>
                <div className="flex items-center justify-center gap-2 text-[#3FB6F6] font-medium">
                  <Heart className="w-4 h-4" />
                  <span>HealthSync Patient</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-l-4 border-l-[#34D399] bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <User className="w-5 h-5 text-[#34D399]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <IdCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">National ID (NIK)</p>
                    <p className="font-mono text-gray-900 text-lg">{user.nationalId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-gray-900 text-lg">{formatDate(user.dateOfBirth)}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                    <Badge variant="outline" className="border-[#3FB6F6] text-[#3FB6F6] bg-[#3FB6F6]/5 font-medium">
                      {user.gender}
                    </Badge>
                  </div>
                </div>

                {user.bloodType && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      <Droplets className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Blood Type</p>
                      <Badge className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white font-medium">
                        {user.bloodType}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-l-4 border-l-[#3FB6F6] bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Mail className="w-5 h-5 text-[#3FB6F6]" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                  <p className="text-gray-900 text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-900 text-lg">{user.phoneNumber}</p>
                </div>
              </div>
            </div>

            {user.address && (
              <>
                <Separator className="my-6" />
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mt-1">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">Address</p>
                    <p className="text-gray-900 leading-relaxed">{user.address}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Health Summary Card */}
        <Card className="border-l-4 border-l-[#34D399] bg-gradient-to-r from-[#34D399]/5 to-[#3FB6F6]/5 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Heart className="w-5 h-5 text-[#34D399]" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-[#3FB6F6]/20 shadow-sm text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#3FB6F6] to-[#34D399] bg-clip-text text-transparent mb-2">
                  {user.bloodType || "N/A"}
                </div>
                <p className="text-sm text-gray-600 font-medium">Blood Type</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#34D399]/20 shadow-sm text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#3FB6F6] bg-clip-text text-transparent mb-2">
                  Active
                </div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#3FB6F6]/20 shadow-sm text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#3FB6F6] to-[#34D399] bg-clip-text text-transparent mb-2">
                  12
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Visits</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#34D399]/20 shadow-sm text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#3FB6F6] bg-clip-text text-transparent mb-2">
                  New
                </div>
                <p className="text-sm text-gray-600 font-medium">Patient</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
