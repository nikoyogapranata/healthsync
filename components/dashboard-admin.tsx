"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar, SidebarProvider, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarRail
} from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BriefcaseMedical, XCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navigationItems = [
  { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Queue Management", url: "/admin-queue", icon: Clock },
  { title: "Doctor Management", url: "/admin/doctors", icon: BriefcaseMedical },
];

export function DashboardAdmin() {
  const pathname = usePathname();
  const [stats, setStats] = useState({
    patientsInQueue: 0,
    totalDoctors: 0,
    unpaidTransactions: 0,
  });
  const [doctorSpecializationData, setDoctorSpecializationData] = useState<any[]>([]);
  const [queueStatsData, setQueueStatsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: doctorsCount } = await supabase
        .from("doctors")
        .select("*", { count: "exact", head: true });

      const { count: queueCount } = await supabase
      .from("queue")
      .select("*", { count: "exact", head: true })
      .eq("queue_status", "Waiting");

    const { count: unpaidCount } = await supabase
      .from("queue")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "Not Paid");


      setStats({
        patientsInQueue: queueCount || 0,
        totalDoctors: doctorsCount || 0,
        unpaidTransactions: unpaidCount || 0,
      });
    };

    const fetchDoctorSpecializations = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("specialization");

      if (!error && data) {
        const grouped = data.reduce((acc: any, cur: any) => {
          const spec = cur.specialization || "Unknown";
          acc[spec] = (acc[spec] || 0) + 1;
          return acc;
        }, {});
        const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
        setDoctorSpecializationData(chartData);
      }
    };

    const fetchQueueStats = async () => {
      const { data, error } = await supabase.rpc("queue_counts_by_day"); // Optional: Create a Postgres function
      if (!error && data) {
        setQueueStatsData(data);
      }
    };

    fetchStats();
    fetchDoctorSpecializations();
    fetchQueueStats(); // Uncomment if you have queue counts by day
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
                    <Image
                      src="/illustrations/logo.png"
                      alt="HealthSync Logo"
                      width={28}
                      height={28}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/28x28/34D399/FFFFFF?text=HS';
                      }}
                    />
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
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
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

      {/* Main Content */}
      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Admin Dashboard" />
        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Today's Overview</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.patientsInQueue}</div>
                  <p className="text-xs text-muted-foreground">Total active queues today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                  <BriefcaseMedical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                  <p className="text-xs text-muted-foreground">Registered medical doctors</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unpaid Transactions</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unpaidTransactions}</div>
                  <p className="text-xs text-muted-foreground">Queues awaiting payment</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <h2 className="text-xl font-semibold mt-10 text-gray-800">Doctor Specializations</h2>
            <Card className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={doctorSpecializationData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3FB6F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
