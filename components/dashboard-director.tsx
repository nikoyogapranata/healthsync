"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

// Layout & UI Components
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Building,
  Users,
  BarChart3,
  PieChart,
  LineChartIcon,
  Stethoscope,
  Activity,
  Pill,
  HospitalIcon,
  ClipboardList,
  AlertTriangle,
  LayoutDashboard,
  Clock,
  Timer,
  HeartPulse,
} from "lucide-react";

// Charting Library
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as PieChartRecharts,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// --- Type Definitions ---
interface KpiData {
  totalPatients: number;
  totalVisitsThisMonth: number;
  activeDoctors: number;
  departmentCount: number;
  avgWaitTime: string;
  avgConsultTime: string;
}
interface VisitData {
  name: string;
  visits: number;
}
interface AgeGenderData {
  name: string;
  Male: number;
  Female: number;
}
interface NameValueData {
  name: string;
  value: number;
}
interface DoctorData {
  id: string;
  name: string | null;
  specialization: string | null;
  patient_count: number;
  status: boolean | null;
}

// --- Component Configuration ---
const directorNavigationItems = [
  { title: "Dashboard", url: "/director-dashboard", icon: LayoutDashboard },
  //{ title: "Patient Demographics", url: "#", icon: Users },
  //{ title: "Clinical Analytics", url: "#", icon: HeartPulse },
  //  { title: "Operations & HR", url: "#", icon: Building },
];

const CHART_COLORS = [
  "#3FB6F6",
  "#34D399",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#6B7280",
  "#EF4444",
  "#10B981",
  "#F97316",
  "#6366F1",
];

export function DashboardDirector() {
  const pathname = usePathname();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityName, setFacilityName] = useState<string | null>(null);

  // States for all data points
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [dailyVisitData, setDailyVisitData] = useState<VisitData[]>([]);
  const [diseaseData, setDiseaseData] = useState<NameValueData[]>([]);
  const [ageGenderData, setAgeGenderData] = useState<AgeGenderData[]>([]);
  const [bloodTypeData, setBloodTypeData] = useState<NameValueData[]>([]);
  const [medicineData, setMedicineData] = useState<NameValueData[]>([]);
  const [activeDoctorsData, setActiveDoctorsData] = useState<DoctorData[]>([]);
  const [departmentVisitData, setDepartmentVisitData] = useState<
    NameValueData[]
  >([]);
  const [allergyData, setAllergyData] = useState<NameValueData[]>([]);
  const [visitTypeData, setVisitTypeData] = useState<NameValueData[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated.");

        const { data: directorProfile, error: directorError } = await supabase
          .from("directors")
          .select(
            `full_name, healthcare_facility_id, healthcare_facilities ( name )`
          )
          .eq("user_id", user.id)
          .single();
        if (directorError || !directorProfile?.healthcare_facility_id)
          throw new Error(
            "Director profile not found or not assigned to a facility."
          );

        const facilityId = directorProfile.healthcare_facility_id;
        setFacilityName(
          directorProfile.healthcare_facilities?.name ?? "Your Facility"
        );
        const today = new Date();
        const thisMonthStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        ).toISOString();

        const [
          patientsCount,
          activeDoctorsRaw,
          departmentCount,
          visitsThisMonth,
          timeMetricsRaw,
          dailyVisitsRaw,
          topDiagnosesRaw,
          topMedicinesRaw,
          topAllergiesRaw,
          visitTypesRaw,
          departmentVisitsRaw,
          patientsRaw,
        ] = await Promise.all([
          supabase
            .from("patients")
            .select("patient_id", { count: "exact", head: true }),
          supabase.rpc("get_doctor_monthly_visits", {
            facility_id: facilityId,
          }),
          supabase
            .from("queue")
            .select("department", { count: "exact", head: true })
            .eq("healthcare_facility_id", facilityId),
          supabase
            .from("queue")
            .select("queue_id", { count: "exact", head: true })
            .eq("healthcare_facility_id", facilityId)
            .gte("created_at", thisMonthStart),
          supabase.rpc("get_kpi_times", { facility_id: facilityId }),
          supabase.rpc("get_daily_visits_for_facility", {
            facility_id: facilityId,
            days_limit: 30,
          }),
          supabase.rpc("get_top_diagnoses", {
            count_limit: 10,
            facility_id: facilityId,
          }),
          supabase.rpc("get_top_medications", {
            count_limit: 10,
            facility_id: facilityId,
          }),
          supabase.rpc("get_top_allergies", {
            count_limit: 10,
            facility_id: facilityId,
          }),
          supabase.rpc("get_visit_type_distribution", {
            facility_id: facilityId,
          }),
          supabase.rpc("get_visits_per_department", {
            facility_id: facilityId,
          }),
          supabase.from("patients").select("gender, date_of_birth, blood_type"),
        ]);

        const timeMetrics = timeMetricsRaw.data?.[0];
        const formatSeconds = (sec: number | null) =>
          sec ? `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s` : "N/A";
        setKpiData({
          totalPatients: patientsCount.count ?? 0,
          activeDoctors:
            activeDoctorsRaw.data?.filter((d) => d.active_status).length ?? 0,
          departmentCount: departmentCount.count ?? 0,
          totalVisitsThisMonth: visitsThisMonth.count ?? 0,
          avgWaitTime: formatSeconds(timeMetrics?.avg_wait_seconds),
          avgConsultTime: formatSeconds(timeMetrics?.avg_consult_seconds),
        });

        setDailyVisitData(
          dailyVisitsRaw.data?.map((d: any) => ({
            name: new Date(d.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
            visits: Number(d.visits),
          })) ?? []
        );
        setDiseaseData(
          topDiagnosesRaw.data?.map((d: any) => ({
            name: d.diagnosis,
            value: Number(d.count),
          })) ?? []
        );
        setMedicineData(
          topMedicinesRaw.data?.map((d: any) => ({
            name: d.medication,
            value: Number(d.count),
          })) ?? []
        );
        setActiveDoctorsData(
          activeDoctorsRaw.data?.map((d: any) => ({
            id: d.doctor_id,
            name: d.full_name,
            specialization: d.specialization,
            patient_count: Number(d.patient_count),
            status: d.active_status,
          })) ?? []
        );
        setDepartmentVisitData(
          departmentVisitsRaw.data?.map((d: any) => ({
            name: d.name,
            value: Number(d.visits),
          })) ?? []
        );
        setAllergyData(
          topAllergiesRaw.data?.map((d: any) => ({
            name: d.name,
            value: Number(d.count),
          })) ?? []
        );
        setVisitTypeData(
          visitTypesRaw.data?.map((d: any) => ({
            name: d.name,
            value: Number(d.value),
          })) ?? []
        );

        if (patientsRaw.data) {
          const ageGroups: { [key: string]: { Male: number; Female: number } } =
            {
              "0-10": { Male: 0, Female: 0 },
              "11-20": { Male: 0, Female: 0 },
              "21-30": { Male: 0, Female: 0 },
              "31-40": { Male: 0, Female: 0 },
              "41-50": { Male: 0, Female: 0 },
              "51-60": { Male: 0, Female: 0 },
              "60+": { Male: 0, Female: 0 },
            };
          const bloodGroups: { [key: string]: number } = {};

          patientsRaw.data.forEach((p) => {
            if (p.blood_type)
              bloodGroups[p.blood_type] = (bloodGroups[p.blood_type] || 0) + 1;
            if (p.date_of_birth && p.gender) {
              const age =
                today.getFullYear() - new Date(p.date_of_birth).getFullYear();
              let group = "60+";
              if (age <= 10) group = "0-10";
              else if (age <= 20) group = "11-20";
              else if (age <= 30) group = "21-30";
              else if (age <= 40) group = "31-40";
              else if (age <= 50) group = "41-50";
              else if (age <= 60) group = "51-60";

              // --- THIS IS THE FIX ---
              // It now checks for gender in a case-insensitive way.
              if (ageGroups[group]) {
                if (p.gender.toLowerCase() === "male") {
                  ageGroups[group].Male++;
                } else if (p.gender.toLowerCase() === "female") {
                  ageGroups[group].Female++;
                }
              }
            }
          });
          setAgeGenderData(
            Object.entries(ageGroups).map(([name, values]) => ({
              name,
              ...values,
            }))
          );
          setBloodTypeData(
            Object.entries(bloodGroups).map(([name, value]) => ({
              name,
              value,
            }))
          );
        }
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError(`Failed to fetch dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [supabase]);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);
  const getStatusColor = (status: boolean | null) =>
    status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const renderLoading = () => (
    <div className="p-8">
      <Skeleton className="h-96 w-full" />
    </div>
  );
  const renderError = () => (
    <Card className="m-8 bg-red-50 border-red-200 text-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle />
          An Error Occurred
        </CardTitle>
        <CardDescription className="text-red-700">{error}</CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
          <Link
            href="/director-dashboard"
            className="flex items-center gap-3 px-2"
          >
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
              <Image
                src="/illustrations/logo.png"
                alt="HealthSync Logo"
                width={28}
                height={28}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/28x28/34D399/FFFFFF?text=HS";
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-lg text-foreground">
                HealthSync
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Director's Panel
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {directorNavigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className={cn(
                        "h-11 px-3 rounded-lg font-medium transition-all duration-200",
                        "hover:bg-accent/50 hover:text-accent-foreground",
                        "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10 data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20 data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold data-[active=true]:shadow-sm"
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

      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Director Dashboard" />
        <main className="flex-1 p-4 md:p-8 space-y-6 bg-slate-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {loading
                  ? "Loading Dashboard..."
                  : facilityName
                  ? `Dashboard for ${facilityName}`
                  : "Director Dashboard"}
              </h1>
              <p className="mt-1 text-gray-600">
                Comprehensive analytics for your assigned healthcare facility.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : error ? (
            renderError()
          ) : (
            kpiData && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Visits This Month
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(kpiData.totalVisitsThisMonth)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Doctors
                    </CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpiData.activeDoctors}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Departments
                    </CardTitle>
                    <HospitalIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpiData.departmentCount}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Wait Time
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpiData.avgWaitTime}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Consult Time
                    </CardTitle>
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpiData.avgConsultTime}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total System Patients
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(kpiData.totalPatients)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">
                <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="demographics">
                <Users className="h-4 w-4 mr-2" /> Patient Demographics
              </TabsTrigger>
              <TabsTrigger value="clinical">
                <HeartPulse className="h-4 w-4 mr-2" /> Clinical Analytics
              </TabsTrigger>
              <TabsTrigger value="operations">
                <Building className="h-4 w-4 mr-2" /> Operations & HR
              </TabsTrigger>
            </TabsList>

            {loading ? (
              renderLoading()
            ) : error ? null : (
              <>
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <CardTitle>Daily Visits (Last 30 Days)</CardTitle>
                        <CardDescription>
                          Patient traffic over the last month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={dailyVisitData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                              formatter={(value: any) => formatNumber(value)}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="visits"
                              stroke="#3FB6F6"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Visit Types (Last 90 Days)</CardTitle>
                        <CardDescription>
                          Distribution of appointment types.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChartRecharts>
                            <Pie
                              data={visitTypeData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label
                            >
                              {visitTypeData.map((_e, i) => (
                                <Cell
                                  key={`cell-${i}`}
                                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any) => formatNumber(value)}
                            />
                            <Legend />
                          </PieChartRecharts>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Patient Load by Department (Last 30 Days)
                      </CardTitle>
                      <CardDescription>
                        Performance and traffic across different departments.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentVisitData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip
                            formatter={(value: any) =>
                              `${formatNumber(value)} visits`
                            }
                          />
                          <Legend />
                          <Bar dataKey="value" name="Total Visits">
                            {departmentVisitData.map((_e, i) => (
                              <Cell
                                key={`cell-${i}`}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="demographics"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Patients by Age & Gender</CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageGenderData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                          />
                          <Legend />
                          <Bar dataKey="Male" stackId="a" fill="#3FB6F6" />
                          <Bar dataKey="Female" stackId="a" fill="#EC4899" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Distribution by Blood Type</CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChartRecharts>
                          <Pie
                            data={bloodTypeData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            label
                          >
                            {bloodTypeData.map((_e, i) => (
                              <Cell
                                key={`cell-${i}`}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                          />
                          <Legend />
                        </PieChartRecharts>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="clinical" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Top 10 Diagnosed Conditions</CardTitle>
                        <CardDescription>
                          Most frequent diagnoses recorded at the facility.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={diseaseData}
                            margin={{ left: 120 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={80}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value: any) =>
                                `${formatNumber(value)} cases`
                              }
                            />
                            <Bar dataKey="value" name="Cases">
                              {diseaseData.map((_e, i) => (
                                <Cell
                                  key={`cell-${i}`}
                                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Top 10 Prescribed Medications</CardTitle>
                        <CardDescription>
                          Most frequently prescribed medications.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={medicineData}
                            margin={{ left: 120 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={80}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value: any) =>
                                `${formatNumber(value)} prescriptions`
                              }
                            />
                            <Bar dataKey="value" name="Prescriptions">
                              {medicineData.map((_e, i) => (
                                <Cell
                                  key={`cell-${i}`}
                                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 Reported Allergies</CardTitle>
                      <CardDescription>
                        Patient allergy distribution across the facility.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChartRecharts>
                          <Pie
                            data={allergyData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                          >
                            {allergyData.map((_e, i) => (
                              <Cell
                                key={`cell-${i}`}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) =>
                              `${formatNumber(value)} patients`
                            }
                          />
                          <Legend />
                        </PieChartRecharts>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="operations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Doctor Roster & Performance</CardTitle>
                      <CardDescription>
                        Patient load for all doctors at this facility in the
                        last 30 days.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Patients Seen</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeDoctorsData.map((d) => (
                            <TableRow key={d.id}>
                              <TableCell className="font-medium">
                                {d.name}
                              </TableCell>
                              <TableCell>{d.specialization}</TableCell>
                              <TableCell>{d.patient_count}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(d.status)}>
                                  {d.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
