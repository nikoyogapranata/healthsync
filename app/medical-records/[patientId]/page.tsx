"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

// --- Icon Imports ---
import { FileText, Plus, ArrowLeft, Loader2, Users, LayoutDashboard, CalendarDays } from "lucide-react";
// --- UI Component Imports ---
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
// MODIFIED: Added imports for the dialog form
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


// --- Type Interfaces ---
// MODIFIED: Added DoctorProfile interface
interface DoctorProfile {
  doctor_id: string;
  full_name: string;
  doctor_healthcare_facility: { healthcare_facility_id: string }[];
}
interface PatientProfile {
  patient_id: string;
  full_name: string;
}
interface EHR {
  ehr_id: string;
  visit_reason: string;
  created_at: string;
  doctors: { full_name: string } | null;
}

const doctorNavigationItems = [
  { title: "Dashboard", url: "/doctor-dashboard", icon: LayoutDashboard },
  { title: "Patient Queue", url: "/doctor-queue", icon: Users },
  { title: "Medical Records", url: "/medical-records", icon: FileText, isActive: true },
  { title: "My Schedule", url: "/doctor-schedule", icon: CalendarDays },
];

function DoctorSidebar() {
  const pathname = usePathname();
  // ... Sidebar implementation remains the same
  return (
    <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4"><SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" asChild className="hover:bg-transparent"><Link href="/doctor-dashboard" className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center"><div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2"><Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28}/></div><div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden"><span className="font-bold text-lg text-foreground">HealthSync</span><span className="text-xs text-muted-foreground font-medium">Doctor Panel</span></div></Link></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarHeader><SidebarContent className="px-2 py-4"><SidebarGroup><SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">Navigation</SidebarGroupLabel><SidebarGroupContent><SidebarMenu className="space-y-1">{doctorNavigationItems.map((item) => (<SidebarMenuItem key={item.title}><SidebarMenuButton asChild isActive={item.url === pathname} tooltip={item.title} className={cn("h-11 px-3 rounded-lg font-medium transition-all duration-200", "hover:bg-accent/50 hover:text-accent-foreground", "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10", "data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20", "data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold", "data-[active=true]:shadow-sm")}><Link href={item.url} className="flex items-center gap-3"><item.icon className="size-5" /><span className="text-sm group-data-[collapsible=icon]:hidden">{item.title}</span></Link></SidebarMenuButton></SidebarMenuItem>))}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar>
  );
}

export default function DoctorPatientEHRList() {
  const supabase = createClient();
  const router = useRouter();
  const { patientId } = useParams<{ patientId: string }>();

  // MODIFIED: Added state for doctor profile and dialog control
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [patientEHRs, setPatientEHRs] = useState<EHR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This function will be reused to refresh the data
  const fetchDetails = async () => {
    if (!patientId) return;
    try {
      // Fetch both patient and EHR data
      const patientRes = await supabase.from('patients').select('patient_id, full_name').eq('patient_id', patientId).single();
      if (patientRes.error) throw new Error("Could not fetch patient details.");
      setSelectedPatient(patientRes.data);

      const ehrRes = await supabase.from('ehr').select('ehr_id, created_at, visit_reason, doctors(full_name)').eq('patient_id', patientId).order('created_at', { ascending: false });
      if (ehrRes.error) throw new Error("Could not fetch EHR history.");
      setPatientEHRs(ehrRes.data as any[]);
    } catch (error: any) {
      setError(error.message);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      // MODIFIED: Fetch doctor's profile on initial load
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication failed.");
        const { data: doctor, error: doctorError } = await supabase
          .from('doctors')
          .select('doctor_id, full_name, doctor_healthcare_facility(healthcare_facility_id)')
          .eq('user_id', user.id)
          .single();
         if (doctorError) throw new Error("Doctor profile not found.");
          setDoctorProfile(doctor as any); // Cast to any to handle the new property temporarily
          await fetchDetails();
      } catch(error: any) {
        setError(error.message);
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [patientId, supabase]);

  // MODIFIED: Added handler to create a new EHR record
  const handleCreateEHR = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPatient || !doctorProfile) return;
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const visitReason = formData.get("visit_reason") as string;
    const facilityId = doctorProfile.doctor_healthcare_facility[0].healthcare_facility_id;


    try {
        const { data, error } = await supabase.from('ehr').insert({
            patient_id: selectedPatient.patient_id,
            doctor_id: doctorProfile.doctor_id,
            visit_reason: visitReason,
            healthcare_facility_id: facilityId, // ADD THIS LINE
        }).select().single();

        if (error) throw error;
        toast({ title: "Success", description: "New EHR created successfully." });
        
        setIsCreateDialogOpen(false);
        await fetchDetails(); // Refresh the EHR list
        router.push(`/medical-records/${patientId}/${data.ehr_id}`); // Navigate to the new detailed page

    } catch (error: any) {
        toast({ title: "Save Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Patient EHR History" />
        <main className="flex-1 p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : error || !selectedPatient ? (
            <Card className="bg-red-50 border-red-200"><CardHeader><CardTitle className="text-red-800">Error</CardTitle><CardDescription className="text-red-700">{error || "Could not load patient data."}</CardDescription></CardHeader></Card>
          ) : (
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => router.push('/medical-records')} className="flex items-center gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Patient List
              </Button>
              <Card>
                {/* MODIFIED: CardHeader now includes the "Create" button */}
                <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <CardTitle className="text-2xl">{selectedPatient.full_name}</CardTitle>
                        <CardDescription>Patient ID: {selectedPatient.patient_id}</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2"/> Create New EHR
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">EHR History</h3>
                  {patientEHRs.length > 0 ? patientEHRs.map(ehr => (
                    <Link key={ehr.ehr_id} href={`/medical-records/${patientId}/${ehr.ehr_id}`}>
                      <Card className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer mt-4">
                        <div>
                          <p className="font-medium">Visit Reason: {ehr.visit_reason || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">Date: {new Date(ehr.created_at).toLocaleString()} | Doctor: {ehr.doctors?.full_name ?? 'N/A'}</p>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Card>
                    </Link>
                  )) : <p className="text-center text-muted-foreground py-8">No EHR records found for this patient.</p>}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </SidebarInset>

      {/* MODIFIED: Added Dialog for creating a new EHR */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New EHR Record</DialogTitle>
                <DialogDescription>
                    Create a new encounter record for {selectedPatient?.full_name}.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEHR} className="space-y-4 pt-4">
                <div>
                    <Label htmlFor="visit_reason">Reason for Visit</Label>
                    <Textarea id="visit_reason" name="visit_reason" placeholder="e.g., Annual check-up, follow-up for hypertension..." required className="mt-2" />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create and View Record
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}