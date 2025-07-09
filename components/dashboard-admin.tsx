"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Clock,
  BriefcaseMedical,
  LayoutDashboard,
  CheckCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Component Configuration ---
const navigationItems = [
  { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Queue Management", url: "/admin-queue", icon: Clock },
  { title: "Doctor Management", url: "/admin-doctor-management", icon: BriefcaseMedical },
];

const PIE_COLORS_STATUS = ["#FFBB28", "#3FB6F6", "#34D399", "#FF8042"];
const PIE_COLORS_DOCTORS = ["#34D399", "#FF5E78"];
const BAR_COLORS = ["#3FB6F6", "#34D399", "#FFBB28", "#FF8042", "#A267F2", "#FF5E78"];

// --- Type Definitions ---
interface Stats {
  patientsInQueue: number;
  totalDoctors: number;
  completedToday: number;
  activeDoctors: number;
}
interface ChartData {
  name: string;
  value: number;
}

export function DashboardAdmin() {
  const pathname = usePathname();
  
  // --- State Management ---
  const [stats, setStats] = useState<Stats>({
    patientsInQueue: 0,
    totalDoctors: 0,
    completedToday: 0,
    activeDoctors: 0,
  });
  const [doctorSpecializationData, setDoctorSpecializationData] = useState<ChartData[]>([]);
  const [queueStatusData, setQueueStatusData] = useState<ChartData[]>([]);
  const [doctorStatusData, setDoctorStatusData] = useState<ChartData[]>([]);
  const [dailyQueueVolume, setDailyQueueVolume] = useState<ChartData[]>([]);
  const [departmentData, setDepartmentData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTodaysQueues, setTotalTodaysQueues] = useState(0);
  
  // FIXED: Added the missing error state
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const [
          doctorsRes,
          queueRes,
          dailyVolumeRes,
        ] = await Promise.all([
          supabase.from("doctors").select("doctor_id, specialization, active_status"),
          // FIXED: Changed 'status' to 'queue_status'
          supabase.from("queue").select("queue_status, department, created_at").gte('created_at', todayStart.toISOString()),
          supabase.from("queue").select("created_at").gte('created_at', sevenDaysAgo.toISOString())
        ]);

        if (doctorsRes.error) throw doctorsRes.error;
        if (queueRes.error) throw queueRes.error;
        if (dailyVolumeRes.error) throw dailyVolumeRes.error;

        if (!doctorsRes.data || !queueRes.data || !dailyVolumeRes.data) {
          throw new Error("One or more data queries returned null. Check RLS policies.");
        }

        const doctors = doctorsRes.data;
        const todaysQueues = queueRes.data;
        const last7DaysQueues = dailyVolumeRes.data;
        
        setTotalTodaysQueues(todaysQueues.length);

        // --- Process Stats ---
        setStats({
          // FIXED: Changed 'q.status' to 'q.queue_status'
          patientsInQueue: todaysQueues.filter(q => q.queue_status === 'Waiting').length,
          totalDoctors: doctors.length,
          completedToday: todaysQueues.filter(q => q.queue_status === 'Completed').length,
          activeDoctors: doctors.filter(d => d.active_status).length,
        });

        // --- Process Chart Data ---
        const specCounts = doctors.reduce((acc, doc) => {
          const spec = doc.specialization || "Unknown";
          acc[spec] = (acc[spec] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setDoctorSpecializationData(Object.entries(specCounts).map(([name, value]) => ({ name, value })));

        // FIXED: Changed 'q.status' to 'q.queue_status'
        const statusCounts = todaysQueues.reduce((acc, q) => {
          const status = q.queue_status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setQueueStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

        const activeCount = doctors.filter(d => d.active_status).length;
        setDoctorStatusData([
          { name: "Active", value: activeCount },
          { name: "Inactive", value: doctors.length - activeCount },
        ]);

        const dailyCounts = last7DaysQueues.reduce((acc, q) => {
            const date = new Date(q.created_at).toLocaleDateString('en-CA');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        setDailyQueueVolume(Object.entries(dailyCounts).map(([name, value]) => ({ name, value })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime()));

        const deptCounts = todaysQueues.reduce((acc, q) => {
            const dept = q.department || "General";
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        setDepartmentData(Object.entries(deptCounts).map(([name, value]) => ({ name, value })));

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                    <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} onError={(e) => { e.currentTarget.src = "https://placehold.co/28x28/34D399/FFFFFF?text=HS"; }} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-bold text-lg text-foreground">HealthSync</span>
                    <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
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
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} className={cn("h-11 px-3 rounded-lg font-medium transition-all duration-200", "hover:bg-accent/50 hover:text-accent-foreground", "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10", "data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20", "data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold", "data-[active=true]:shadow-sm")}>
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

      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Admin Dashboard" />
        <main className="flex-1 p-4 md:p-8">
          {/* Display Error Message if it exists */}
          {error && (
            <Card className="mb-4 bg-red-50 border-red-200 text-red-800">
                <CardHeader>
                    <CardTitle>An Error Occurred</CardTitle>
                    <CardDescription className="text-red-700">{error}</CardDescription>
                </CardHeader>
            </Card>
          )}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Clinic Overview</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.patientsInQueue}</div>
                  <p className="text-xs text-muted-foreground">Currently waiting patients</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedToday}</div>
                  <p className="text-xs text-muted-foreground">Patients served today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                  <BriefcaseMedical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeDoctors} / {stats.totalDoctors}</div>
                  <p className="text-xs text-muted-foreground">Total active workforce</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Patient Volume</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTodaysQueues}</div>
                  <p className="text-xs text-muted-foreground">Total patients for today</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Queue Status</CardTitle>
                        <CardDescription>Breakdown of patient statuses for today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={queueStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {queueStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS_STATUS[index % PIE_COLORS_STATUS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Workforce</CardTitle>
                        <CardDescription>Active vs. Inactive doctors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={doctorStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                                    {doctorStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS_DOCTORS[index % PIE_COLORS_DOCTORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Queue Volume (Last 7 Days)</CardTitle>
                        <CardDescription>Patient traffic trends over the past week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyQueueVolume} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Patients" stroke="#3FB6F6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Specializations</CardTitle>
                        <CardDescription>Distribution of doctors across specializations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={doctorSpecializationData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" name="Number of Doctors">
                                    {doctorSpecializationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Traffic by Department</CardTitle>
                        <CardDescription>Busiest departments based on today's queue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Number of Patients">
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
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