"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  Settings,
  ChevronRight,
  Home,
  MessageCircle,
  Loader2,
  ClipboardList,
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
import { Header } from "./ui/header";
import { Footer } from "./ui/footer";
import { createClient } from "@/utils/supabase/client";

// --- Type Definitions for Fetched Data ---
interface LatestQueue {
  queueNumber: string;
  service: string;
  queueDate: string;
  queueTime: string;
  status: string;
}

interface LastVisitSummary {
  name: string;
  totalVisits: number;
  lastDiagnosis: string;
  lastDoctor: string;
  lastVisitDate: string;
}

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, isActive: true },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  {
    title: "Medical Records",
    url: "/patients-medical-records",
    icon: FileText,
  },
  { title: "Ask AI", url: "/ask-ai", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

function AppSidebar() {
  // Sidebar component remains the same...
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                  <Image
                    src="/illustrations/logo.png"
                    alt="HealthSync Logo"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-lg text-foreground">
                    HealthSync
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Patient Dashboard
                  </span>
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
                      "data-[active=true]:shadow-sm"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
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

export function DashboardPatient() {
  // MODIFIED: State is now split for clarity
  const [lastVisitSummary, setLastVisitSummary] =
    useState<LastVisitSummary | null>(null);
  const [latestQueue, setLatestQueue] = useState<LatestQueue | null>(null);
  const [greeting, setGreeting] = useState("Welcome");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in.");

        const { data: patientProfile, error: patientError } = await supabase
          .from("patients")
          .select("patient_id, full_name")
          .eq("user_id", user.id)
          .single();

        if (patientError || !patientProfile)
          throw new Error(
            "Could not find a patient profile for the current user."
          );

        const patientId = patientProfile.patient_id;
        const patientName = patientProfile.full_name || "Patient";

        // --- FETCH DATA INDEPENDENTLY ---
        const [latestQueueRes, lastEhrRes, totalVisitsRes] = await Promise.all([
          // Query 1: Get the absolute latest queue entry
          supabase
            .from("queue")
            .select("queue_number, department, queue_status, created_at")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          // Query 2: Get the absolute latest EHR entry for summary
          supabase
            .from("ehr")
            .select(
              "created_at, doctors(full_name), diagnosis(diagnosis_description, diseases(name))"
            )
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          // Query 3: Get total visit count
          supabase
            .from("ehr")
            .select("*", { count: "exact", head: true })
            .eq("patient_id", patientId),
        ]);

        // --- Process Latest Queue Data ---
        if (latestQueueRes.data) {
          const queue = latestQueueRes.data;
          const queueDate = new Date(queue.created_at);
          setLatestQueue({
            queueNumber: queue.queue_number || "N/A",
            service: queue.department || "N/A",
            status: queue.queue_status || "N/A",
            queueDate: queueDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            queueTime: queueDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          });
        }

        // --- Process Last Visit Summary Data ---
        if (lastEhrRes.data) {
          const ehr = lastEhrRes.data;
          const visitDate = new Date(ehr.created_at);
          const doctor = Array.isArray(ehr.doctors)
            ? ehr.doctors[0]
            : ehr.doctors;
          const diagnosis = Array.isArray(ehr.diagnosis)
            ? ehr.diagnosis[0]
            : ehr.diagnosis;

          setLastVisitSummary({
            name: patientName,
            totalVisits: totalVisitsRes.count ?? 0,
            // v-- THIS LINE IS UPDATED --v
            // This version correctly accesses the first element of the array
            lastDiagnosis:
              diagnosis?.diseases?.[0]?.name ||
              diagnosis?.diagnosis_description ||
              "No diagnosis on record",
            lastDoctor: doctor?.full_name ?? "N/A",
            lastVisitDate: visitDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          });
        } else {
          // Handle new user with no EHR records yet
          setLastVisitSummary({
            name: patientName,
            totalVisits: 0,
            lastDiagnosis: "No diagnosis on record",
            lastDoctor: "N/A",
            lastVisitDate: "N/A",
          });
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.message || "Failed to fetch data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "called":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

/*
if (loading) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="ml-4 text-lg">Loading Dashboard...</p>
    </div>
  );
}
*/


  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <Header pageTitle="Dashboard" />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
              <Card className="relative overflow-hidden col-span-full flex flex-col md:flex-row items-center">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/illustrations/signin-signup.jpg"
                    alt="Welcome background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/60"></div>
                </div>
                <div className="relative z-10 p-8 text-white md:w-2/3">
                  <h1 className="text-3xl font-bold">
                    {greeting}, {lastVisitSummary?.name || "User"}!
                  </h1>
                  <p className="mt-2 text-blue-100">
                    Here’s a summary of your health journey and upcoming
                    appointments.
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* --- Latest Queue Card --- */}
                <Card className="border-l-4 border-l-[#3FB6F6] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Current Queue Status
                    </CardTitle>
                    <CardDescription>
                      Your most recent queue information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {latestQueue ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Queue Number
                            </p>
                            <p className="text-2xl font-bold text-[#3FB6F6]">
                              {latestQueue.queueNumber}
                            </p>
                          </div>
                          <Badge className={getStatusColor(latestQueue.status)}>
                            {latestQueue.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Service / Department
                          </p>
                          <p>{latestQueue.service}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Date & Time
                          </p>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p>
                              {latestQueue.queueDate}, {latestQueue.queueTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12 space-y-3">
                        <ClipboardList className="h-10 w-10 text-gray-300" />
                        <p className="text-lg font-semibold">
                          You have no active queue
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Book an appointment to see your queue status here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href="/appointments" passHref>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-[#3FB6F6] hover:text-[#34D399]"
                      >
                        <span>View All Appointments</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* --- Last Visit Summary Card --- */}
                <Card className="border-l-4 border-l-[#34D399] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Last Visit Summary
                    </CardTitle>
                    <CardDescription>
                      Information from your most recent visit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lastVisitSummary ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Total Visits
                            </p>
                            <p className="text-2xl font-bold text-[#34D399]">
                              {lastVisitSummary.totalVisits}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-sm font-medium text-gray-500">
                              Last Visit Date
                            </p>
                            <p>{lastVisitSummary.lastVisitDate}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Last Diagnosis
                          </p>
                          <p>{lastVisitSummary.lastDiagnosis}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Attending Doctor
                          </p>
                          <p>{lastVisitSummary.lastDoctor}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No visit history found.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href="/patients-medical-records" passHref>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-[#34D399] hover:text-[#3FB6F6]"
                      >
                        <span>View Full Medical Records</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                          <CardTitle className="text-2xl mb-2">
                            Ask AI
                          </CardTitle>
                          <CardDescription className="text-base">
                            Get instant health answers from our AI assistant
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            Chat with our intelligent AI assistant for quick
                            answers about symptoms, medications, and health
                            tips. Available 24/7 to help with your health
                            questions and provide reliable medical information.
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
                      <CardTitle className="text-lg text-white">
                        Thank You!
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-200">
                        We’re glad you’re here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-100 leading-relaxed">
                        Thank you for trusting <strong>HealthSync</strong> with
                        your healthcare. We’re committed to helping you manage
                        your health with confidence and clarity. Explore your
                        records, appointments, and AI-powered features — all in
                        one place.
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </main>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
