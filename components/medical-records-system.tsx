// This is your original file, now simplified.
// e.g., app/medical-records/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

// --- Icon Imports ---
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Loader2,
  History,
  CalendarCheck2,
} from "lucide-react";
// --- UI Component Imports ---
import { Header } from "./ui/header";
import { Footer } from "./ui/footer";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- TypeScript Interfaces ---
interface PatientProfile {
  patient_id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
}

const doctorNavigationItems = [
  { title: "Dashboard", url: "/doctor-dashboard", icon: LayoutDashboard },
  { title: "Patient Queue", url: "/doctor-queue", icon: Users },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: FileText,
    isActive: true,
  },
  { title: "My Schedule", url: "/doctor-schedule", icon: CalendarDays },
];

function DoctorSidebar() {
  const pathname = usePathname();
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
                href="/doctor-dashboard"
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
                    Doctor Panel
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
              {doctorNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
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
    </Sidebar>
  );
}

// --- Main Page Component ---
export function MedicalRecordsSystem() {
  const supabase = createClient();
  const router = useRouter(); // Initialize router

  const [todaysPatientList, setTodaysPatientList] = useState<PatientProfile[]>(
    []
  );
  const [historicalPatientList, setHistoricalPatientList] = useState<
    PatientProfile[]
  >([]);
  const [filteredTodaysList, setFilteredTodaysList] = useState<
    PatientProfile[]
  >([]);
  const [filteredHistoricalList, setFilteredHistoricalList] = useState<
    PatientProfile[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [todaySearchTerm, setTodaySearchTerm] = useState("");
  const [historySearchTerm, setHistorySearchTerm] = useState("");

  useEffect(() => {
    const getUniquePatientsFromQueue = (
      queueItems: any[]
    ): PatientProfile[] => {
      if (!queueItems) return [];
      const patientMap = new Map<string, PatientProfile>();
      queueItems.forEach((item) => {
        const patientData = Array.isArray(item.patients)
          ? item.patients[0]
          : item.patients;
        if (patientData && patientData.patient_id) {
          patientMap.set(patientData.patient_id, patientData);
        }
      });
      return Array.from(patientMap.values());
    };

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        const { data: doctor, error: doctorError } = await supabase
          .from("doctors")
          .select("doctor_id")
          .eq("user_id", user.id)
          .single();
        if (doctorError) throw new Error("Doctor profile not found.");

        const { data: allQueueData, error: queueError } = await supabase
          .from("queue")
          .select(
            "created_at, patients!inner(patient_id, full_name, date_of_birth, gender)"
          )
          .eq("doctor_id", doctor.doctor_id);
        if (queueError) throw queueError;

        const today = new Date().toDateString();
        const todaysQueues = allQueueData.filter(
          (q) => new Date(q.created_at).toDateString() === today
        );

        const uniqueTodaysPatients = getUniquePatientsFromQueue(todaysQueues);
        const uniqueHistoricalPatients =
          getUniquePatientsFromQueue(allQueueData);

        setTodaysPatientList(uniqueTodaysPatients);
        setHistoricalPatientList(uniqueHistoricalPatients);
        setFilteredTodaysList(uniqueTodaysPatients);
        setFilteredHistoricalList(uniqueHistoricalPatients);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [supabase]);

  useEffect(() => {
    setFilteredTodaysList(
      todaysPatientList.filter((p) =>
        p.full_name.toLowerCase().includes(todaySearchTerm.toLowerCase())
      )
    );
  }, [todaySearchTerm, todaysPatientList]);

  useEffect(() => {
    setFilteredHistoricalList(
      historicalPatientList.filter((p) =>
        p.full_name.toLowerCase().includes(historySearchTerm.toLowerCase())
      )
    );
  }, [historySearchTerm, historicalPatientList]);

  // MODIFIED: This handler now navigates to the new page
  const handlePatientSelect = (patient: PatientProfile) => {
    router.push(`/medical-records/${patient.patient_id}`);
  };

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="My Patients" />
        <main className="flex-1 p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Patient Lists
                </h1>
                <p className="mt-1 text-gray-600">
                  Access records for today's patients or view your complete
                  patient history.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Today's Patients</CardTitle>
                      <CardDescription>
                        Select a patient to view and manage their records.
                      </CardDescription>
                    </div>
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search today's patients..."
                        className="pl-9"
                        value={todaySearchTerm}
                        onChange={(e) => setTodaySearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTodaysList.length > 0 ? (
                        filteredTodaysList.map((patient) => (
                          <TableRow
                            key={patient.patient_id}
                            className="cursor-pointer hover:bg-slate-50"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <TableCell className="font-medium">
                              {patient.full_name}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                patient.date_of_birth
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View Records
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                            No patients in the queue for today.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Patient History</CardTitle>
                      <CardDescription>
                        A read-only list of all patients you have previously
                        seen.
                      </CardDescription>
                    </div>
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search patient history..."
                        className="pl-9"
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Gender</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistoricalList.length > 0 ? (
                        filteredHistoricalList.map((patient) => (
                          <TableRow
                            key={patient.patient_id}
                            className="bg-gray-50"
                          >
                            <TableCell className="font-medium text-muted-foreground">
                              {patient.full_name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(
                                patient.date_of_birth
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {patient.gender}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center h-24">
                            No patient history found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
