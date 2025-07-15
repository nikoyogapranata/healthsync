"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Clock,
  BriefcaseMedical,
  LayoutDashboard,
  UserCircle,
  Stethoscope,
  Search,
  Users,
  FileText,
  CalendarDays,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";

// Navigation for Doctor's Dashboard
const navigationItems = [
  { title: "Dashboard", url: "/doctor-dashboard", icon: LayoutDashboard },
  { title: "Patient Queue", url: "/doctor-queue", icon: Users },
  { title: "Medical Records", url: "/medical-records", icon: FileText },
  { title: "My Schedule", url: "/doctor-schedule", icon: CalendarDays },
];

// Interface for Queue data
interface Queue {
  queue_id: string;
  queue_number: string;
  patients: { full_name: string } | null;
  departments: { name: string } | null;
  queue_status: "Waiting" | "In Progress" | "Completed" | "Cancelled";
  payment_status: "Not Paid" | "Paid" | "Waived";
  created_at: string;
  visit_type?: string;
  triage_priority?: string;
  called_at?: string | null;
  completed_at?: string | null;
}

// Interface for Doctor data
interface Doctor {
    doctor_id: string;
    full_name: string;
}

// Reusable Queue Table Component
const QueueTable = ({
  queues,
  onRowClick,
  getStatusColor,
}: {
  queues: Queue[];
  onRowClick: (queue: Queue) => void;
  getStatusColor: (status: string, type: "queue" | "payment") => string;
}) => {
  if (queues.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center h-24">
          No queues assigned to you.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {queues.map((q) => (
        <TableRow
          key={q.queue_id}
          onClick={() => onRowClick(q)}
          className="cursor-pointer hover:bg-gray-50"
        >
          <TableCell className="font-medium">{q.queue_number}</TableCell>
          <TableCell>{q.patients?.full_name ?? "—"}</TableCell>
          <TableCell>
            <Badge className={getStatusColor(q.queue_status, "queue")}>
              {q.queue_status}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className={getStatusColor(q.payment_status, "payment")}>
              {q.payment_status}
            </Badge>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export function DoctorQueueManagement() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todaySearchTerm, setTodaySearchTerm] = useState("");
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const fetchDoctorAndQueues = async () => {
      setLoading(true);

      // 1. Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast({ title: "Authentication Error", description: "Could not retrieve user session.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2. Fetch the logged-in doctor's profile
      const { data: doctorProfile, error: doctorError } = await supabase
        .from('doctors')
        .select('doctor_id, full_name')
        .eq('user_id', session.user.id)
        .single();

      if (doctorError || !doctorProfile) {
        toast({ title: "Error", description: "Could not find a doctor profile for this user.", variant: "destructive" });
        setLoading(false);
        return;
      }
      setDoctor(doctorProfile);

      // 3. Fetch queues assigned to this doctor
      const { data: queueData, error: queueError } = await supabase
        .from("queue")
        .select(`
            queue_id, queue_number, queue_status, payment_status,
            visit_type, created_at, called_at, completed_at,
            patients ( full_name ),
            departments ( name )
          `)
        .eq('doctor_id', doctorProfile.doctor_id) // Filter by doctor_id
        .order("created_at", { ascending: false });

      if (queueError) {
        toast({ title: "Error", description: "Could not fetch queue data.", variant: "destructive" });
      } else {
        setQueues(queueData as any);
      }
      setLoading(false);
    };

    fetchDoctorAndQueues();

    // Setup realtime subscription
    const channel = supabase
      .channel("queue-doctot-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        (payload) => {
            // Re-fetch data to ensure doctor-specific filtering is applied
            fetchDoctorAndQueues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

const handleUpdateStatus = async (
    queue_id: string,
    // The 'updates' parameter now strictly requires a 'queue_status' property
    updates: { queue_status: "Waiting" | "In Progress" | "Completed" | "Cancelled" }
  ) => {
    const timestampUpdates: Partial<Queue> = {};

    if (updates.queue_status === "In Progress") {
      // Sets the 'called_at' time when status is 'In Progress'
      timestampUpdates.called_at = new Date().toISOString();
    } else if (updates.queue_status === "Waiting") {
      // **NEW**: Resets the 'called_at' time to null when status is 'Waiting'
      timestampUpdates.called_at = null;
    }

    if (updates.queue_status === "Completed") {
      timestampUpdates.completed_at = new Date().toISOString();
    }
    
    // The 'finalUpdates' object is now correctly typed without 'undefined'
    const finalUpdates = {
      ...updates,
      ...timestampUpdates,
    };

    const { error } = await supabase
      .from("queue")
      .update(finalUpdates)
      .eq("queue_id", queue_id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Status has been updated." });
      
      if (selectedQueue?.queue_id === queue_id) {
        setSelectedQueue((prev) => (prev ? { ...prev, ...finalUpdates } : null));
      }

      // This state update will no longer cause a type error
      setQueues((prev) => prev.map((q) => (q.queue_id === queue_id ? { ...q, ...finalUpdates } : q)));
    }
  };

  const openQueueModal = (queue: Queue) => {
    setSelectedQueue(queue);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string, type: "queue" | "payment") => {
    // Color logic remains the same
    if (type === "queue") {
        switch (status) {
            case "Waiting": return "bg-yellow-100 text-yellow-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Completed": return "bg-green-100 text-green-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }
    if (type === "payment") {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-800";
            case "Not Paid": return "bg-red-100 text-red-800";
            case "Waived": return "bg-orange-100 text-orange-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }
    return "bg-gray-100 text-gray-800";
  };
  
  // --- Filtering Logic ---
  const isToday = (dateString: string) => {
    const queueDate = new Date(dateString);
    const today = new Date();
    return (
      queueDate.getDate() === today.getDate() &&
      queueDate.getMonth() === today.getMonth() &&
      queueDate.getFullYear() === today.getFullYear()
    );
  };
  
  const queueMatchesSearch = (queue: Queue, term: string) => {
    const lowerCaseTerm = term.toLowerCase();
    if (!lowerCaseTerm) return true;
    return (
      queue.patients?.full_name?.toLowerCase().includes(lowerCaseTerm) ||
      queue.queue_number.toLowerCase().includes(lowerCaseTerm)
    );
  };

  const todaysQueues = queues
    .filter(q => isToday(q.created_at))
    .filter(q => queueMatchesSearch(q, todaySearchTerm));

  const historicalQueues = queues.filter(q => queueMatchesSearch(q, historySearchTerm));

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
            <SidebarMenu>
                <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                    <Link href="/doctor-dashboard" className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                        <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} onError={(e) => { e.currentTarget.src = "https://placehold.co/28x28/34D399/FFFFFF?text=HS"; }} />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-lg text-foreground">HealthSync</span>
                        <span className="text-xs text-muted-foreground font-medium">Doctor Panel</span>
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
        <Header pageTitle="Patient Queue" />
        <main className="flex-1 p-4 md:p-8 space-y-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="mb-1">Today's Queue</CardTitle>
                <CardDescription>Your assigned patient queue for today.</CardDescription>
              </div>
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by Queue Number or Patient Name..." className="w-full pl-9 h-10" value={todaySearchTerm} onChange={(e) => setTodaySearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Queue Number</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Queue Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (<TableRow><TableCell colSpan={4} className="text-center h-24">Loading your queue...</TableCell></TableRow>) : (<QueueTable queues={todaysQueues} onRowClick={openQueueModal} getStatusColor={getStatusColor} />)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="mb-1">My Queue History</CardTitle>
                <CardDescription>Complete history of your past queues.</CardDescription>
              </div>
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by Queue Number or Patient Name..." className="w-full pl-9 h-10" value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Queue Number</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Queue Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {loading ? (<TableRow><TableCell colSpan={4} className="text-center h-24">Loading history...</TableCell></TableRow>) : (<QueueTable queues={historicalQueues} onRowClick={openQueueModal} getStatusColor={getStatusColor} />)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </SidebarInset>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Queue Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              View details and manage the queue status.
            </DialogDescription>
          </DialogHeader>
          {selectedQueue && (
            <div className="space-y-6 pt-2">
                <div className="rounded-2xl border bg-slate-50 p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground">Queue Number</p>
                            <h2 className="text-2xl font-bold text-blue-600">{selectedQueue.queue_number}</h2>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <Badge className={getStatusColor(selectedQueue.queue_status, "queue")}>{selectedQueue.queue_status}</Badge>
                            <Badge className={getStatusColor(selectedQueue.payment_status, "payment")}>{selectedQueue.payment_status}</Badge>
                        </div>
                    </div>
                    <div className="grid gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2"><UserCircle className="size-4" /><strong>Patient:</strong> {selectedQueue.patients?.full_name ?? "N/A"}</div>
                        <div className="flex items-center gap-2"><Stethoscope className="size-4" /><strong>Doctor:</strong> {doctor?.full_name ?? "N/A"}</div>
                        <div className="flex items-center gap-2"><BriefcaseMedical className="size-4" /><strong>Department:</strong> {selectedQueue.departments?.name ?? "N/A"}</div>
                        <div className="flex items-center gap-2"><strong>Visit Type:</strong> {selectedQueue.visit_type ?? "—"}</div>
                        <div className="flex items-center gap-2"><strong>Created At:</strong> {new Date(selectedQueue.created_at).toLocaleString()}</div>
                        <div className="flex items-center gap-2"><strong>Called At:</strong> {selectedQueue.called_at ? new Date(selectedQueue.called_at).toLocaleString() : "—"}</div>
                        <div className="flex items-center gap-2"><strong>Completed At:</strong> {selectedQueue.completed_at ? new Date(selectedQueue.completed_at).toLocaleString() : "—"}</div>
                    </div>
                </div>

                {/* --- Queue Status Controls --- */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Update Queue Status</Label>
                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedQueue.queue_id, { queue_status: "Waiting" })}>Waiting</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedQueue.queue_id, { queue_status: "In Progress" })}>In Progress</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedQueue.queue_id, { queue_status: "Completed" })}>Completed</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedQueue.queue_id, { queue_status: "Cancelled" })}>Cancelled</Button>
                    </div>
                </div>

                {/* --- PAYMENT STATUS CONTROLS REMOVED --- */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}