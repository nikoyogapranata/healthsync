"use client"

import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  Settings,
  ChevronRight,
  CheckCircle,
  User,
  LogOut,
  Home,
  MessageCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Header } from "./ui/header"; // Import reusable Header
import { Footer } from "./ui/footer"; // Import reusable Footer

// Navigation items
const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, isActive: true },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Medical Records", url: "/medical-records", icon: FileText },
  { title: "Ask AI", url: "/ask-ai", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

// App Sidebar Component
function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link
                href="/dashboard"
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
                    isActive={item.isActive}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 rounded-lg font-medium transition-all duration-200",
                      "hover:bg-accent/50 hover:text-accent-foreground",
                      "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10",
                      "data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20",
                      "data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold",
                      "data-[active=true]:shadow-sm",
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
  );
}

// Main Dashboard Component
export function DashboardPatient() {
  // Sample patient data
  const patientData = {
    name: "John Smith",
    totalVisits: 12,
    lastDiagnosis: "Type 2 Diabetes Mellitus",
    lastDoctor: "Dr. Michael Brown, MD",
    lastVisitDate: "March 12, 2023",
  };

  // Sample queue data
  const queueData = {
    queueNumber: "A-17",
    service: "General Practice",
    date: "April 15, 2023",
    time: "10:30 AM",
    status: "Waiting",
  };

  // Function to get queue status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Called":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header - Modern Design */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
            <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-foreground">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Profile Dropdown in Header - Modern Design */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white font-semibold text-sm">
                      JS
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Smith</p>
                      <p className="text-xs leading-none text-muted-foreground">john.smith@email.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-accent/50">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-accent/50">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-accent/50 text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content with Padding */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {patientData.name}!</h1>
                    <p className="mt-2 text-gray-600">Manage your health easily in one place</p>
                  </div>
                </div>

                {/* Main Cards */}
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

                {/* Ask AI & Thank You Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Ask AI Card */}
                  <Card className="border-l-4 border-l-gray-800 overflow-hidden col-span-4 md:col-span-3">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/3 w-full pr-0 pt-6 pb-6 pl-6">
                        <img
                          src="/illustrations/chatbot.jpg"
                          alt="Chatbot Illustration"
                          className="object-contain w-full h-full md:rounded-none rounded-t-2xl"
                        />
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <CardHeader className="pb-4 px-0">
                            <CardTitle className="text-2xl mb-2">Ask AI</CardTitle>
                            <CardDescription className="text-base">
                              Get instant health answers from our AI assistant
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-0">
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                              Chat with our intelligent AI assistant for quick answers about symptoms, medications, and
                              health tips. Available 24/7 to help with your health questions and provide reliable
                              medical information.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-medium">
                                Symptom Checker
                              </span>
                              <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-medium">
                                Medication Info
                              </span>
                              <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-medium">
                                Health Tips
                              </span>
                            </div>
                          </CardContent>
                        </div>
                        <CardFooter className="pt-4 px-0">
                          <Link href="/ask-ai" passHref>
                            <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-2">
                              Start Conversation
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>

                  {/* Thank You Card */}
                    <Card className="relative overflow-hidden col-span-4 md:col-span-1 flex flex-col justify-between text-white p-6">
                    <Image
                      src="/illustrations/signin-signup.jpg"
                      alt="Background Illustration"
                      fill
                      className="object-cover z-0"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-slate-900/80 z-10"></div>
                    <div className="relative z-20 flex flex-col justify-center h-full space-y-4">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg text-white">Thank You!</CardTitle>
                        <CardDescription className="text-sm text-gray-200">We're glad you're here.</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-100 leading-relaxed">
                          Thank you for trusting <strong>HealthSync</strong> with your healthcare. We're committed to
                          helping you manage your health with confidence and clarity. Explore your records,
                          appointments, and AI-powered features — all in one place.
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Modern Footer */}
            <footer className="bg-gray-900 text-white">
              <div className="container mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  {/* Brand Section */}
                  <div className="md:col-span-2">
                    <Link href="/landing" className="flex items-center mb-6">
                      <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl">
                        <img
                          src="/illustrations/logo.png"
                          alt="HealthSync Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#3FB6F6] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                        HealthSync
                      </span>
                    </Link>
                    <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                      Revolutionizing healthcare management with secure, integrated digital medical records. Connecting
                      patients, doctors, and facilities for better health outcomes.
                    </p>
                    <div className="flex space-x-6">
                      <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                        <Facebook size={24} />
                        <span className="sr-only">Facebook</span>
                      </Link>
                      <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                        <Twitter size={24} />
                        <span className="sr-only">Twitter</span>
                      </Link>
                      <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                        <Instagram size={24} />
                        <span className="sr-only">Instagram</span>
                      </Link>
                      <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                        <Mail size={24} />
                        <span className="sr-only">Email</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#features"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#testimonials"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Testimonials
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/register"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Get Started
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Support</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                          Help Center
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">© 2025 HealthSync. All rights reserved.</p>
                  <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>SOC 2 Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}