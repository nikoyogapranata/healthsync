"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Main layout components
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Supabase client
import { createClient } from "@/utils/supabase/client";

// Icons
import {
  ClipboardList,
  User,
  Users,
  Clock,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Loader2,
  ChevronRight,
} from "lucide-react";

// --- Type Definitions for Fetched Data ---
interface QueueSummary {
  patientsToday: number;
  patientsWaiting: number;
  patientsFinished: number;
}

// MODIFIED: Updated QueueItem interface
interface QueueItem {
  id: string; 
  name: string | null;
  visitType: string | null;
  queuedAt: string;
  status: string;
}

interface DiagnosisItem {
  patientName: string | null;
  diagnosis: string | null;
}

interface PrescriptionItem {
    patientName: string | null;
    prescription: string | null;
}

// --- Navigation Items for Doctor's Sidebar ---
const doctorNavigationItems = [
  { title: "Dashboard", url: "/doctor-dashboard", icon: LayoutDashboard },
  { title: "Patient Queue", url: "/doctor-queue", icon: Users },
  { title: "Medical Records", url: "/doctor-records", icon: FileText },
  { title: "My Schedule", url: "/doctor-schedule", icon: CalendarDays },
];

export function DashboardDoctor() {
  const pathname = usePathname();
  const supabase = createClient();

  // --- State for Dynamic Data ---
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [queueSummary, setQueueSummary] = useState<QueueSummary>({
    patientsToday: 0,
    patientsWaiting: 0,
    patientsFinished: 0,
  });
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [diagnosesToday, setDiagnosesToday] = useState<DiagnosisItem[]>([]);
  const [prescriptionsToday, setPrescriptionsToday] = useState<PrescriptionItem[]>([]);
  
  // --- Data Fetching Logic ---
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication failed. Please log in again.");

        const { data: doctorProfile, error: profileError } = await supabase
          .from("doctors")
          .select("doctor_id, full_name")
          .eq("user_id", user.id)
          .single();

        if (profileError || !doctorProfile) throw new Error("Could not find a doctor profile for the current user.");
        
        setDoctorName(doctorProfile.full_name);
        const doctorId = doctorProfile.doctor_id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Fetch Queue Summary
        const { count: totalCount } = await supabase.from('queue').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).gte('created_at', todayStart.toISOString()).lte('created_at', todayEnd.toISOString());
        const { count: waitingCount } = await supabase.from('queue').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).eq('queue_status', 'Waiting').gte('created_at', todayStart.toISOString()).lte('created_at', todayEnd.toISOString());
        const { count: finishedCount } = await supabase.from('queue').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).eq('queue_status', 'Finished').gte('created_at', todayStart.toISOString()).lte('created_at', todayEnd.toISOString());
        
        setQueueSummary({
            patientsToday: totalCount ?? 0,
            patientsWaiting: waitingCount ?? 0,
            patientsFinished: finishedCount ?? 0,
        });

        // MODIFIED: Fetch Queue List with updated columns
        const { data: queueListData, error: queueError } = await supabase
            .from('queue')
            .select(`
                queue_id,
                created_at,
                visit_type,
                queue_status,
                patients ( full_name )
            `)
            .eq('doctor_id', doctorId)
            .gte('created_at', todayStart.toISOString())
            .lte('created_at', todayEnd.toISOString())
            .order('created_at', { ascending: true }); // Order by creation time
        
        if(queueError) {
          console.error("Supabase queue error:", queueError);
          throw new Error("Failed to fetch queue list.");
        }
        
        // MODIFIED: Map new data to the state object
        const formattedQueueData = queueListData.map(item => {
            const patient = Array.isArray(item.patients) ? item.patients[0] : item.patients;
            return {
                id: item.queue_id,
                name: patient?.full_name ?? 'N/A',
                visitType: item.visit_type,
                queuedAt: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: item.queue_status
            }
        });
        setQueueData(formattedQueueData);

        // Fetch Recent Diagnoses
        const { data: diagnosesData, error: diagnosesError } = await supabase.from('diagnosis').select(`diagnosis_description, queue ( patients ( full_name ) )`).eq('doctor_id', doctorId).gte('created_at', todayStart.toISOString()).lte('created_at', todayEnd.toISOString()).limit(5);
        if(diagnosesError) throw new Error("Failed to fetch recent diagnoses.");
        setDiagnosesToday(diagnosesData.map(d => {
            const queue = Array.isArray(d.queue) ? d.queue[0] : d.queue;
            const patient = Array.isArray(queue?.patients) ? queue?.patients[0] : queue?.patients;
            return { patientName: patient?.full_name ?? "N/A", diagnosis: d.diagnosis_description };
        }));

        // Fetch Recent Prescriptions
        const { data: prescriptionsData, error: prescriptionsError } = await supabase.from('prescriptions').select(`medication_name, ehr ( patients ( full_name ) )`).eq('doctor_id', doctorId).gte('created_at', todayStart.toISOString()).lte('created_at', todayEnd.toISOString()).limit(5);
        if(prescriptionsError) throw new Error("Failed to fetch recent prescriptions.");
        setPrescriptionsToday(prescriptionsData.map(p => {
            const ehr = Array.isArray(p.ehr) ? p.ehr[0] : p.ehr;
            const patient = Array.isArray(ehr?.patients) ? ehr?.patients[0] : ehr?.patients;
            return { patientName: patient?.full_name ?? "N/A", prescription: p.medication_name };
        }));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const currentPatientInProgress = queueData.find(p => p.status === "In Progress");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Finished": return <Badge className="bg-green-100 text-green-800">Finished</Badge>;
      case "In Progress": return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "Waiting": return <Badge className="bg-gray-100 text-gray-800">Waiting</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                <Link href="/doctor-dashboard" className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                    <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} onError={(e) => { e.currentTarget.src = 'https://placehold.co/28x28/34D399/FFFFFF?text=HS'; }}/>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-bold text-lg text-foreground">HealthSync</span>
                    <span className="text-xs text-muted-foreground font-medium">Doctor's Panel</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {doctorNavigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} className={cn("h-11 px-3 rounded-lg font-medium transition-all duration-200", "hover:bg-accent/50 hover:text-accent-foreground", "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10 data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20 data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold data-[active=true]:shadow-sm")}>
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
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Dashboard" />
        <main className="flex-1 p-4 md:p-8 space-y-8">
          
          {loading ? (
            <div className="flex items-center justify-center h-24 rounded-lg bg-gray-100">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200 text-red-800">
                <CardHeader>
                    <CardTitle>An Error Occurred</CardTitle>
                    <CardDescription className="text-red-700">{error}</CardDescription>
                </CardHeader>
            </Card>
          ) : (
            <Card className="relative overflow-hidden col-span-full flex flex-col md:flex-row items-center">
               <div className="absolute inset-0 z-0">
                  <Image src="/illustrations/signin-signup.jpg" alt="Welcome background" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/60"></div>
               </div>
               <div className="relative z-10 p-8 text-white md:w-2/3">
                  <h1 className="text-3xl font-bold">{greeting}, Dr. {doctorName}!</h1>
                  <p className="mt-2 text-gray-200">Thank you for your dedication. Here’s what your day looks like.</p>
                  <Button asChild className="mt-4 bg-white text-slate-900 hover:bg-gray-200">
                    <Link href="/doctor-schedule">View Today's Schedule <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
               </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /><span>Today’s Patient Queue Summary</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Total Patients Today:</span><span className="font-bold">{queueSummary.patientsToday}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Patients Waiting:</span><span className="font-bold">{queueSummary.patientsWaiting}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Patients Finished:</span><span className="font-bold">{queueSummary.patientsFinished}</span></div>
                </CardContent>
              </Card>
                
              {/* MODIFIED: Updated Current Patient Card */}
              {currentPatientInProgress && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900"><User className="h-5 w-5" /><span>Current Patient In Progress</span></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xl font-bold text-blue-900">{currentPatientInProgress.name}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Visit Type:</span> {currentPatientInProgress.visitType}</p>
                    <p className="text-sm text-gray-700 flex items-center"><Clock className="h-4 w-4 mr-2" /><span>Queued at {currentPatientInProgress.queuedAt}</span></p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments / Queue List</CardTitle>
                </CardHeader>
                <CardContent>
                   {/* MODIFIED: Updated Table Structure */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Queued At</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Visit Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queueData.length > 0 ? queueData.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.queuedAt}</TableCell>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.visitType}</TableCell>
                                <TableCell>{getStatusBadge(patient.status)}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No patients in the queue today.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /><span>Recent Activity Overview</span></CardTitle>
                  <CardDescription>Latest diagnoses and prescriptions made today.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Diagnoses Made Today</h3>
                    <Table>
                      <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Diagnosis</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {diagnosesToday.length > 0 ? diagnosesToday.map((item, index) => (
                          <TableRow key={index}><TableCell>{item.patientName}</TableCell><TableCell className="font-medium">{item.diagnosis}</TableCell></TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">No diagnoses recorded today.</TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Prescriptions Made Today</h3>
                    <Table>
                      <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Prescription</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {prescriptionsToday.length > 0 ? prescriptionsToday.map((item, index) => (
                          <TableRow key={index}><TableCell>{item.patientName}</TableCell><TableCell className="font-medium">{item.prescription}</TableCell></TableRow>
                        )) : (
                           <TableRow>
                                <TableCell colSpan={2} className="text-center">No prescriptions issued today.</TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}