"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Home,
  FileText,
  Settings,
  MessageCircle,
  Calendar as LucideCalendar,
  CalendarIcon,
  AlertCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

// Import UI Components (assuming they exist in your project)
import { Header } from "./ui/header";
import { Footer } from "./ui/footer";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
interface Facility {
  healthcare_facility_id: string;
  name: string;
}
interface Department {
  department_id: string;
  name: string;
}
interface Doctor {
  doctor_id: string;
  full_name: string;
  doctor_healthcare_facility_id: string;
}
interface TimeSlot {
  value: string;
  label: string;
}
interface AppointmentHistoryItem {
  queue_id: string;
  appointment_time: string;
  queue_status: string;
  healthcare_facilities: { name: string } | null;
  doctors: { full_name: string } | null;
  departments: { name: string } | null;
}
interface ActiveQueue extends AppointmentHistoryItem {
  queue_number: string;
}

// --- Reusable Sidebar ---
const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  {
    title: "Appointments",
    url: "/appointments",
    icon: LucideCalendar,
    isActive: true,
  },
  {
    title: "Medical Records",
    url: "/patients-medical-records",
    icon: FileText,
  },
  { title: "Ask AI", url: "/ask-ai", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

function AppSidebar() {
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
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
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

// --- Main Appointments Page Component ---
export function AppointmentsOnline() {
  const supabase = createClient();

  // Form selections state
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [complaint, setComplaint] = useState("");
  const [selectedVisitType, setSelectedVisitType] = useState("Consultation");

  // Data state
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [appointmentHistory, setAppointmentHistory] = useState<
    AppointmentHistoryItem[]
  >([]);
  const [activeQueue, setActiveQueue] = useState<ActiveQueue | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [cancellationsToday, setCancellationsToday] = useState(0);

  const visitTypeOptions = [
    { value: "Consultation", label: "Consultation" },
    { value: "Follow-up / Control", label: "Follow-up / Control" },
    { value: "Annual Check-up", label: "Annual Check-up" },
    { value: "New Patient Visit", label: "New Patient Visit" },
    { value: "Procedure", label: "Procedure" }, // Added this line
  ];

  // UI state
  const [loading, setLoading] = useState({
    initial: true,
    departments: false,
    doctors: false,
    slots: false,
    booking: false,
  });
  const [error, setError] = useState<string | null>(null);

  const resetSelections = (
    level: "facility" | "department" | "doctor" | "date"
  ) => {
    if (level === "facility") {
      setSelectedDepartment("");
      setDepartments([]);
    }
    if (["facility", "department"].includes(level)) {
      setSelectedDoctor("");
      setDoctors([]);
    }
    if (["facility", "department", "doctor"].includes(level)) {
      setSelectedDate(undefined);
    }
    if (["facility", "department", "doctor", "date"].includes(level)) {
      setSelectedTimeSlot("");
      setAvailableTimeSlots([]);
    }
  };

  // 1. Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading((prev) => ({ ...prev, initial: true }));
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to book an appointment.");
        setLoading((prev) => ({ ...prev, initial: false }));
        return;
      }

      const { data: patientProfile, error: patientError } = await supabase
        .from("patients")
        .select("patient_id")
        .eq("user_id", session.user.id)
        .single();
      if (patientError || !patientProfile) {
        setError("Could not find your patient profile.");
        setLoading((prev) => ({ ...prev, initial: false }));
        return;
      }
      setPatientId(patientProfile.patient_id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [facilitiesRes, appointmentsRes, activeQueueRes, cancellationsRes] =
        await Promise.all([
          supabase
            .from("healthcare_facilities")
            .select("healthcare_facility_id, name"),
          supabase
            .from("queue")
            .select(
              "queue_id, appointment_time, queue_status, healthcare_facilities(name), doctors(full_name), departments(name)"
            )
            .eq("patient_id", patientProfile.patient_id)
            .order("appointment_time", { ascending: false }),
          supabase
            .from("queue")
            .select(
              "*, healthcare_facilities(name), doctors(full_name), departments(name)"
            )
            .eq("patient_id", patientProfile.patient_id)
            .in("queue_status", ["Waiting", "In Progress"])
            .maybeSingle(),
          supabase
            .from("queue")
            .select("*", { count: "exact", head: true })
            .eq("patient_id", patientProfile.patient_id)
            .eq("queue_status", "Cancelled")
            .gte("created_at", today.toISOString())
            .lt("created_at", tomorrow.toISOString()),
        ]);

      if (facilitiesRes.error)
        setError("Could not fetch healthcare facilities.");
      else setFacilities(facilitiesRes.data);
      if (appointmentsRes.error)
        setError("Could not fetch appointment history.");
      else setAppointmentHistory(appointmentsRes.data as any);
      if (activeQueueRes.data) setActiveQueue(activeQueueRes.data as any);
      if (cancellationsRes.count !== null)
        setCancellationsToday(cancellationsRes.count);

      setLoading((prev) => ({ ...prev, initial: false }));
    };
    fetchInitialData();
  }, [supabase]);

  // 2. Fetch departments
  useEffect(() => {
    if (!selectedFacility) return;
    const fetchDepartments = async () => {
      setLoading((prev) => ({ ...prev, departments: true }));
      resetSelections("facility");
      const { data, error } = await supabase
        .from("departments")
        .select("department_id, name")
        .eq("healthcare_facility_id", selectedFacility);
      if (error)
        toast({
          title: "Error",
          description: "Could not fetch departments.",
          variant: "destructive",
        });
      else setDepartments(data);
      setLoading((prev) => ({ ...prev, departments: false }));
    };
    fetchDepartments();
  }, [selectedFacility, supabase]);

  // 3. Fetch doctors
  // 3. Fetch doctors
  useEffect(() => {
    if (!selectedDepartment) return;
    const fetchDoctors = async () => {
      setLoading((prev) => ({ ...prev, doctors: true }));
      resetSelections("department");
      const { data, error } = await supabase
        .from("doctor_healthcare_facility")
        .select(
          "doctor_healthcare_facility_id, doctors!inner(doctor_id, full_name)"
        )
        .eq("department_id", selectedDepartment);

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch doctors.",
          variant: "destructive",
        });
      } else if (data) {
        // FIX: Trust the runtime data shape (object) and use 'as any' to bypass the incorrect type error.
        const fetchedDoctors = data
          .map((item) => {
            const doctorData = item.doctors as any; // Treat as 'any' to access properties
            if (doctorData && doctorData.doctor_id) {
              return {
                doctor_id: doctorData.doctor_id,
                full_name: doctorData.full_name,
                doctor_healthcare_facility_id:
                  item.doctor_healthcare_facility_id,
              };
            }
            return null;
          })
          .filter((doc): doc is Doctor => doc !== null);

        setDoctors(fetchedDoctors);
      }
      setLoading((prev) => ({ ...prev, doctors: false }));
    };
    fetchDoctors();
  }, [selectedDepartment, supabase]);

  // 4. Fetch time slots
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    const fetchSlots = async () => {
      setLoading((prev) => ({ ...prev, slots: true }));
      resetSelections("date");
      const doctorInfo = doctors.find((d) => d.doctor_id === selectedDoctor);
      if (!doctorInfo) return;

      const dayOfWeek = selectedDate.getDay();
      const { data: schedule, error: scheduleError } = await supabase
        .from("doctor_schedules")
        .select("start_time, end_time, appointment_duration_minutes")
        .eq(
          "doctor_healthcare_facility_id",
          doctorInfo.doctor_healthcare_facility_id
        )
        .eq("day_of_week", dayOfWeek)
        .single();

      if (scheduleError || !schedule) {
        setAvailableTimeSlots([]);
        setLoading((prev) => ({ ...prev, slots: false }));
        return;
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data: bookedAppointments, error: bookedError } = await supabase
        .from("queue")
        .select("appointment_time")
        .eq("doctor_id", selectedDoctor)
        .gte("appointment_time", `${dateStr}T00:00:00Z`)
        .lt("appointment_time", `${dateStr}T23:59:59Z`);
      if (bookedError) {
        toast({
          title: "Error",
          description: "Could not fetch booked slots.",
          variant: "destructive",
        });
        setLoading((prev) => ({ ...prev, slots: false }));
        return;
      }

      const bookedSlots = bookedAppointments.map((appt) =>
        format(new Date(appt.appointment_time), "HH:mm")
      );
      const slots: TimeSlot[] = [];
      let currentTime = new Date(
        `${selectedDate.toDateString()} ${schedule.start_time}`
      );
      const endTime = new Date(
        `${selectedDate.toDateString()} ${schedule.end_time}`
      );

      while (currentTime < endTime) {
        const timeValue = format(currentTime, "HH:mm");
        if (!bookedSlots.includes(timeValue)) {
          slots.push({
            value: timeValue,
            label: format(currentTime, "hh:mm a"),
          });
        }
        currentTime.setMinutes(
          currentTime.getMinutes() + schedule.appointment_duration_minutes
        );
      }
      setAvailableTimeSlots(slots);
      setLoading((prev) => ({ ...prev, slots: false }));
    };
    fetchSlots();
  }, [selectedDoctor, selectedDate, doctors, supabase]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!patientId || !selectedTimeSlot) {
        toast({
          title: "Incomplete Form",
          description: "Please fill out all fields to book an appointment.",
          variant: "destructive",
        });
        return;
      }
      setLoading((prev) => ({ ...prev, booking: true }));
      const [hour, minute] = selectedTimeSlot.split(":");
      const appointmentDateTime = new Date(selectedDate!);
      appointmentDateTime.setHours(parseInt(hour), parseInt(minute));

      const { data, error } = await supabase
        .from("queue")
        .insert({
          patient_id: patientId,
          healthcare_facility_id: selectedFacility,
          department_id: selectedDepartment,
          doctor_id: selectedDoctor,
          appointment_time: appointmentDateTime.toISOString(),
          visit_type: selectedVisitType,
          payment_status: "Not Paid",
          visit_reason: complaint,
        })
        .select(
          "*, healthcare_facilities(name), doctors(full_name), departments(name)"
        )
        .single();

      if (error) {
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your appointment has been booked.",
        });
        setActiveQueue(data as any);
        resetSelections("facility");
        setComplaint("");
      }
      setLoading((prev) => ({ ...prev, booking: false }));
    },
    [
      patientId,
      selectedFacility,
      selectedDepartment,
      selectedDoctor,
      selectedDate,
      selectedTimeSlot,
      complaint,
      supabase,
    ]
  );

  const handleCancelAppointment = async () => {
    if (!activeQueue) return;
    if (cancellationsToday >= 5) {
      toast({
        title: "Cancellation Limit Reached",
        description:
          "You have already cancelled 5 appointments today and cannot cancel more.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase
      .from("queue")
      .update({ queue_status: "Cancelled" })
      .eq("queue_id", activeQueue.queue_id);
    if (error)
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    else {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      setActiveQueue(null);
      setCancellationsToday((prev) => prev + 1);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Waiting: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
    };
    return (
      <Badge
        className={cn(
          "border-none",
          statusClasses[status] || "bg-gray-100 text-gray-800"
        )}
      >
        {status}
      </Badge>
    );
  };

  const disabledDates = useMemo(() => ({ before: new Date() }), []);

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <Header pageTitle="Appointments" />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Online Appointment System
                </h1>
                <p className="mt-2 text-gray-600">
                  Schedule and manage your appointments with ease.
                </p>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Tabs defaultValue="book-appointment" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="book-appointment">
                    Book Appointment
                  </TabsTrigger>
                  <TabsTrigger value="appointment-history">
                    Appointment History
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="book-appointment"
                  className="space-y-6 pt-4"
                >
                  {activeQueue && (
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          Current Active Appointment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Queue Number
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {activeQueue.queue_number || "Pending"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Appointment Time
                            </p>
                            <p className="text-lg font-semibold">
                              {format(
                                new Date(activeQueue.appointment_time),
                                "PPP, hh:mm a"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Doctor
                            </p>
                            <p className="text-lg font-semibold">
                              {activeQueue.doctors?.full_name}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancelAppointment}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Appointment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader>
                      <CardTitle>Book New Appointment</CardTitle>
                      <CardDescription>
                        Follow the steps below to schedule your visit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="facility">
                              Select Healthcare Facility
                            </Label>
                            <Select
                              value={selectedFacility}
                              onValueChange={setSelectedFacility}
                              disabled={loading.initial}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select facility..." />
                              </SelectTrigger>
                              <SelectContent>
                                {facilities.map((f) => (
                                  <SelectItem
                                    key={f.healthcare_facility_id}
                                    value={f.healthcare_facility_id}
                                  >
                                    {f.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">
                              Select Department
                            </Label>
                            <Select
                              value={selectedDepartment}
                              onValueChange={setSelectedDepartment}
                              disabled={
                                !selectedFacility || loading.departments
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    loading.departments
                                      ? "Loading..."
                                      : !selectedFacility
                                      ? "Select a facility first"
                                      : "Select department..."
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (
                                  <SelectItem
                                    key={d.department_id}
                                    value={d.department_id}
                                  >
                                    {d.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doctor">Select Doctor</Label>
                            <Select
                              value={selectedDoctor}
                              onValueChange={setSelectedDoctor}
                              disabled={!selectedDepartment || loading.doctors}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    loading.doctors
                                      ? "Loading..."
                                      : !selectedDepartment
                                      ? "Select a department first"
                                      : "Select doctor..."
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map((d) => (
                                  <SelectItem
                                    key={d.doctor_id}
                                    value={d.doctor_id}
                                  >
                                    {d.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="visitType">Type of Visit</Label>
                            <Select
                              value={selectedVisitType}
                              onValueChange={setSelectedVisitType}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select visit type..." />
                              </SelectTrigger>
                              <SelectContent>
                                {visitTypeOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                            {/* Appointment Date */}
                            <div className="space-y-2">
                              <Label htmlFor="date">
                                Select Appointment Date
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                    disabled={!selectedDoctor}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                      format(selectedDate, "PPP")
                                    ) : (
                                      <span>
                                        {!selectedDoctor
                                          ? "Select a doctor first"
                                          : "Select date"}
                                      </span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                    disabled={disabledDates}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Preferred Time */}
                            <div className="space-y-2">
                              <Label htmlFor="time">
                                Select Preferred Time
                              </Label>
                              <Select
                                value={selectedTimeSlot}
                                onValueChange={setSelectedTimeSlot}
                                disabled={
                                  loading.slots ||
                                  availableTimeSlots.length === 0
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      loading.slots
                                        ? "Loading slots..."
                                        : !selectedDate
                                        ? "Select a date first"
                                        : "Select an available time..."
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableTimeSlots.map((slot) => (
                                    <SelectItem
                                      key={slot.value}
                                      value={slot.value}
                                    >
                                      {slot.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="complaint">
                              Chief Complaint (Optional)
                            </Label>
                            <Textarea
                              id="complaint"
                              value={complaint}
                              onChange={(e) => setComplaint(e.target.value)}
                              placeholder="Describe your symptoms or reason for visit..."
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]"
                            disabled={loading.booking || !selectedTimeSlot}
                          >
                            <>
                              {loading.booking && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Book Appointment
                            </>
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent
                  value="appointment-history"
                  className="space-y-6 pt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Facility</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading.initial ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center h-24"
                              >
                                Loading history...
                              </TableCell>
                            </TableRow>
                          ) : appointmentHistory.length > 0 ? (
                            appointmentHistory.map((appt) => (
                              <TableRow key={appt.queue_id}>
                                <TableCell>
                                  {appt.appointment_time
                                    ? format(
                                        new Date(appt.appointment_time),
                                        "PPp"
                                      )
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {appt.healthcare_facilities?.name}
                                </TableCell>
                                <TableCell>{appt.departments?.name}</TableCell>
                                <TableCell>{appt.doctors?.full_name}</TableCell>
                                <TableCell>
                                  {getStatusBadge(appt.queue_status)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center h-24"
                              >
                                No appointment history found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
