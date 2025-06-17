"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Settings,
  AlertCircle,
  ChevronRight,
  Bell,
  User,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardPatient() {
  const [showNotification, setShowNotification] = useState(true)

  // Sample patient data
  const patientData = {
    name: "John Smith",
    totalVisits: 12,
    lastDiagnosis: "Type 2 Diabetes Mellitus",
    lastDoctor: "Dr. Michael Brown, MD",
    lastVisitDate: "March 12, 2023",
  }

  // Sample queue data
  const queueData = {
    queueNumber: "A-17",
    service: "General Practice",
    date: "April 15, 2023",
    time: "10:30 AM",
    status: "Waiting", // Waiting, Called, Completed
  }

  // Function to get queue status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Called":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {patientData.name}!</h1>
          <p className="mt-2 text-gray-600">Manage your health easily in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Appointment Reminder</span>
                <span className="text-xs text-muted-foreground">Tomorrow, 10:30 AM - General Practice</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Lab Results Available</span>
                <span className="text-xs text-muted-foreground">Today, 08:15 AM</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showNotification && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Appointment Reminder</AlertTitle>
          <AlertDescription className="text-blue-700">
            You have an appointment with Dr. Michael Brown on April 15, 2023 at 10:30 AM in General Practice.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-blue-800 hover:text-blue-900 hover:bg-blue-100"
            onClick={() => setShowNotification(false)}
          >
            &times;
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Queue Status Card */}
        <Card className="border-l-4 border-l-[#3FB6F6] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Queue Status</CardTitle>
            <CardDescription>Your current queue information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Queue Number</p>
                  <p className="text-2xl font-bold text-[#3FB6F6]">{queueData.queueNumber}</p>
                </div>
                <Badge className={getStatusColor(queueData.status)}>{queueData.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Service</p>
                  <p>{queueData.service}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p>
                      {queueData.date}, {queueData.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/appointments" passHref>
              <Button variant="ghost" className="p-0 h-auto text-[#3FB6F6] hover:text-[#34D399]">
                <span>View Queue Details</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Medical Records Summary Card */}
        <Card className="border-l-4 border-l-[#34D399] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Medical Records Summary</CardTitle>
            <CardDescription>Your health information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold text-[#34D399]">{patientData.totalVisits}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Last Visit</p>
                  <p>{patientData.lastVisitDate}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Last Diagnosis</p>
                <p>{patientData.lastDiagnosis}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Doctor</p>
                <p>{patientData.lastDoctor}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/medical-records" passHref>
              <Button variant="ghost" className="p-0 h-auto text-[#34D399] hover:text-[#3FB6F6]">
                <span>View Medical Records</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link href="/appointments" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Book Appointment</CardTitle>
                <CardDescription className="text-xs mt-1">Schedule your visit</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/medical-records" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <FileText className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Medical Records</CardTitle>
                <CardDescription className="text-xs mt-1">View your health history</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/appointment-history" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <ClipboardList className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Appointment History</CardTitle>
                <CardDescription className="text-xs mt-1">View your visit history</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <Settings className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Account Settings</CardTitle>
                <CardDescription className="text-xs mt-1">Manage profile and preferences</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">New</Badge>
                  <h3 className="font-medium">Telemedicine Service Available</h3>
                </div>
                <p className="text-sm text-gray-600">
                  You can now consult with doctors online through our telemedicine feature. This service is available
                  for all HealthSync patients.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>
                  <h3 className="font-medium">Holiday Operating Hours</h3>
                </div>
                <p className="text-sm text-gray-600">
                  During the holiday period from April 10-15, 2023, we will only handle emergency cases. Normal services
                  will resume on April 16, 2023.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium mb-2">Help</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-[#3FB6F6]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#3FB6F6]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Contact</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@healthsync.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Policies</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-[#3FB6F6]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#3FB6F6]">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>&copy; 2023 HealthSync. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
