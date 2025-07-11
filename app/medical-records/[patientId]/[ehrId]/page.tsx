"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

// PDF Generation Imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Icon Imports ---
import {
  FileText,
  Plus,
  ArrowLeft,
  Edit,
  Loader2,
  Users,
  LayoutDashboard,
  CalendarDays,
  Pill,
  Microscope,
  Syringe,
  Building2,
  User as UserIcon,
  HeartPulse,
  Phone,
  Mail,
  Download,
  Sparkles, // AI Icon
  AlertCircle, // Error Icon
} from "lucide-react";

// --- UI Component Imports ---
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";


// --- TypeScript Interfaces ---
interface DoctorProfile {
  doctor_id: string;
  full_name: string;
}
interface PatientProfile {
  patient_id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  users: { email: string } | null;
  phone_number: string;
  patient_allergies: { allergy_type: { name: string } }[];
}
interface DiagnosisHistory {
    diagnosis_description: string;
    treatment_plan: string;
    created_at: string;
}
interface DetailedEHR {
  ehr_id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
  visit_reason: string;
  patients: PatientProfile | null;
  doctors: { full_name: string } | null;
  healthcare_facilities: { name: string; healthcare_facility_id: string; } | null;
  diagnosis: any[];
  prescriptions: any[];
  examinations: any[];
  physical_examinations: any[];
  doctor_notes: any[];
  vaccinations: any[];
}


// --- [NEW] Dialog Component for AI Diagnosis ---
function AddDiagnosisDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  visitReason,
  diagnosisHistory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any, dataType: string) => Promise<void>;
  isSubmitting: boolean;
  visitReason: string;
  diagnosisHistory: DiagnosisHistory[];
}) {
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiError, setAiError] = useState("");
  const [subjectiveComplaint, setSubjectiveComplaint] = useState("");

  useEffect(() => {
    if (open) {
      setSubjectiveComplaint("");
      setAiRecommendation("");
      setAiError("");
    }
  }, [open]);

  const handleGetAIRecommendation = async () => {
    if (!subjectiveComplaint) {
        toast({
            title: "Informasi Kurang",
            description: "Silakan isi keluhan pasien terlebih dahulu untuk mendapatkan rekomendasi AI.",
            variant: "destructive"
        });
        return;
    }

    setIsAILoading(true);
    setAiRecommendation("");
    setAiError("");
    try {
      console.log("Sending data to AI for analysis:", {
        currentComplaint: subjectiveComplaint,
        visitReason: visitReason,
        pastHistory: diagnosisHistory,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let historySummary = "";
      if (diagnosisHistory && diagnosisHistory.length > 0) {
        historySummary = `**Catatan dari Riwayat Medis Sebelumnya:**\n${diagnosisHistory
          .map(
            (dx) =>
              `- ${new Date(dx.created_at).toLocaleDateString(
                "id-ID"
              )}: Didiagnosis "${dx.diagnosis_description}"`
          )
          .join("\n")}\n\n`;
      } else {
        historySummary = `**Catatan dari Riwayat Medis Sebelumnya:**\n- Tidak ada riwayat diagnosis relevan yang tercatat.\n\n`;
      }

      const recommendationText = `Berdasarkan informasi yang diberikan:

${historySummary}**Analisis Keluhan Saat Ini ("${subjectiveComplaint}"):**
* **Diagnosis Paling Mungkin:** Acute Pharyngitis (J02.9). Gejala sangat khas.
* **Diagnosis Banding:** Tonsillitis (J03.9), Influenza (J11.1). Perlu pemeriksaan fisik lebih lanjut untuk membedakan.

**Rencana Perawatan Disarankan:**
1.  **Pemeriksaan Fisik:** Fokus pada faring, tonsil, dan kelenjar getah bening leher.
2.  **Terapi Simptomatik:** Anjurkan istirahat, hidrasi, dan berikan Paracetamol 500mg 3x1 jika demam/nyeri.
3.  **Edukasi:** Jelaskan kemungkinan penyebabnya adalah virus. Pantau dalam 3 hari.`;
      
      setAiRecommendation(recommendationText);
    } catch (error) {
      setAiError("Gagal mendapatkan rekomendasi dari Asisten AI.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const finalData = { ...data, subjective_complaint: subjectiveComplaint };
    onSubmit(finalData, "Diagnosis");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Diagnosis</DialogTitle>
          <DialogDescription>
            Isi keluhan pasien, lalu dapatkan rekomendasi AI sebelum menyimpan diagnosis final.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjective_complaint">Keluhan Pasien (Anamnesis)</Label>
              <Textarea
                id="subjective_complaint"
                name="subjective_complaint"
                required
                placeholder="Contoh: Pasien datang dengan keluhan nyeri telan sejak 2 hari yang lalu, disertai demam dan badan terasa pegal..."
                className="min-h-[100px]"
                value={subjectiveComplaint}
                onChange={(e) => setSubjectiveComplaint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis_description">Diagnosis Dokter (Final)</Label>
              <Input id="diagnosis_description" name="diagnosis_description" required placeholder="e.g., Acute Pharyngitis"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment_plan">Rencana Perawatan</Label>
              <Textarea id="treatment_plan" name="treatment_plan" required rows={5} placeholder="e.g., Istirahat, hidrasi, Paracetamol..."/>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Diagnosis
              </Button>
            </DialogFooter>
          </form>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" /> AI Assistant
                </Label>
                <Button size="sm" variant="outline" onClick={handleGetAIRecommendation} disabled={isAILoading}>
                    {isAILoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Get Recommendation"}
                </Button>
            </div>
            <div className="border rounded-lg p-4 min-h-[320px] bg-blue-50/50 text-sm max-h-[420px] overflow-y-auto">
              {isAILoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p className="font-medium">Menganalisis Keluhan Pasien...</p>
                </div>
              )}
              {aiError && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-2" /><p>{aiError}</p>
                </div>
              )}
              {aiRecommendation && (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans">
                  <pre className="bg-transparent p-0 font-sans whitespace-pre-wrap">{aiRecommendation}</pre>
                </div>
              )}
               {!isAILoading && !aiRecommendation && !aiError && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <p>Isi keluhan pasien di form sebelah kiri, lalu klik "Get Recommendation".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// --- Generic Dialog for other data types ---
function AddEhrDataDialog({
  dataType,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  dataType: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any, dataType: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  if (!dataType) return null;
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data, dataType);
  };
  const renderFormFields = () => {
    switch (dataType) {
      case "Prescription":
        return (
          <>
            <Label htmlFor="medication_name">Medication Name</Label>
            <Input id="medication_name" name="medication_name" required />
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" name="dosage" required />
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" name="duration" required />
            <Label htmlFor="instruction">Instruction</Label>
            <Textarea id="instruction" name="instruction" required />
          </>
        );
      case "Examination":
        return (
          <>
            <Label htmlFor="examination_name">Examination Name</Label>
            <Input id="examination_name" name="examination_name" required />
            <Label htmlFor="examination_type">Type (e.g., Blood Test, X-Ray)</Label>
            <Input id="examination_type" name="examination_type" required />
            <Label htmlFor="note">Result / Note</Label>
            <Textarea id="note" name="note" required />
          </>
        );
      case "Note":
        return (
          <>
            <Label htmlFor="note">Doctor's Note</Label>
            <Textarea id="note" name="note" required className="min-h-[150px]" />
          </>
        );
      case "Vaccination":
        return (
          <>
            <Label htmlFor="vaccine_name">Vaccine Name</Label>
            <Input id="vaccine_name" name="vaccine_name" required />
            <Label htmlFor="vaccine_type">Vaccine Type</Label>
            <Input id="vaccine_type" name="vaccine_type" />
            <Label htmlFor="dose_number">Dose Number</Label>
            <Input id="dose_number" name="dose_number" required />
          </>
        );
      default:
        return <p>Form not available for this data type.</p>;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {dataType}</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new entry to the record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">{renderFormFields()}</div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// --- PDF Generation Logic ---
const generateEHR_PDF = (patient: PatientProfile, ehr: DetailedEHR) => {
  const doc = new jsPDF();
  let y = 15;

  const addSection = (title: string, content: () => void) => {
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 15;
    }
    doc.setFontSize(16);
    doc.text(title, 14, y);
    y += 8;
    doc.setFontSize(11);
    content();
  };

  doc.setFontSize(22);
  doc.text("HealthSync Medical Record Summary", 14, y);
  y += 10;

  addSection("Patient Information", () => {
    autoTable(doc, {
      startY: y,
      body: [
        ["Name", patient.full_name],
        ["Date of Birth", new Date(patient.date_of_birth).toLocaleDateString()],
        ["Gender", patient.gender],
        [
          "Contact",
          `${patient.phone_number || "N/A"} | ${patient.users?.email || "N/A"}`,
        ],
        ["Address", patient.address || "N/A"],
      ],
      theme: "grid",
      styles: { cellPadding: 2, fontSize: 10 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  });

  addSection("Visit Information", () => {
    autoTable(doc, {
      startY: y,
      body: [
        ["Facility", ehr.healthcare_facilities?.name || "N/A"],
        ["Attending Doctor", ehr.doctors?.full_name || "N/A"],
        ["Date of Visit", new Date(ehr.created_at).toLocaleDateString()],
      ],
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  });

  if (ehr.diagnosis.length > 0) {
    addSection("Diagnoses", () => {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Diagnosis", "Doctor", "Treatment Plan"]],
        body: ehr.diagnosis.map((d: any) => [
          new Date(d.created_at).toLocaleDateString(),
          d.diagnosis_description,
          d.doctors.full_name,
          d.treatment_plan,
        ]),
        theme: "striped",
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  if (ehr.prescriptions.length > 0) {
    addSection("Medications Prescribed", () => {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Medication", "Dosage", "Instructions"]],
        body: ehr.prescriptions.map((p: any) => [
          new Date(p.created_at).toLocaleDateString(),
          p.medication_name,
          p.dosage,
          p.instruction,
        ]),
        theme: "striped",
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  doc.save(
    `HealthSync_Record_${patient.full_name.replace(" ", "_")}_${new Date(
      ehr.created_at
    ).toLocaleDateString("en-CA")}.pdf`
  );
};

// --- Navigation & Sidebar ---
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
export default function DoctorSingleEHRDetail() {
  const supabase = createClient();
  const router = useRouter();
  const { ehrId } = useParams<{ ehrId: string }>();

  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [ehr, setEhr] = useState<DetailedEHR | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEHR, setEditingEHR] = useState<DetailedEHR | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [addingDataType, setAddingDataType] = useState<string | null>(null);
  const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEHRDetails = async () => {
      if (!ehrId) return;
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication failed.");

        const { data: doctor, error: doctorError } = await supabase
          .from("doctors").select("doctor_id, full_name").eq("user_id", user.id).single();
        if (doctorError) throw new Error("Could not find your doctor profile.");
        setDoctorProfile(doctor);

        const { data: ehrData, error: ehrError } = await supabase
          .from("ehr").select(`*, patients!inner(*, users(email), patient_allergies(*, allergy_type(name))), doctors(full_name), healthcare_facilities(*), diagnosis(*, doctors(full_name)), prescriptions(*), examinations(*), physical_examinations(*), doctor_notes(*), vaccinations(*)`).eq("ehr_id", ehrId).single();
        if (ehrError) throw new Error(`Could not fetch EHR record: ${ehrError.message}`);
        
        const detailedEhrData = ehrData as DetailedEHR;
        setEhr(detailedEhrData);

        if (detailedEhrData?.patients?.patient_id) {
            const { data: historyData, error: historyError } = await supabase
                .from('diagnosis')
                .select('diagnosis_description, treatment_plan, created_at')
                .eq('patient_id', detailedEhrData.patients.patient_id)
                .neq('ehr_id', ehrId)
                .order('created_at', { ascending: false });
            if(historyError) console.warn("Could not fetch diagnosis history:", historyError.message);
            else setDiagnosisHistory(historyData as DiagnosisHistory[]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEHRDetails();
  }, [ehrId, supabase]);

  const handleUpdateVisitReason = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEHR) return;
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const visitReason = formData.get("visit_reason") as string;
    try {
      const { error } = await supabase.from("ehr").update({ visit_reason: visitReason }).eq("ehr_id", editingEHR.ehr_id);
      if (error) throw error;
      toast({ title: "Success", description: "Visit reason updated successfully." });
      setEhr((prev) => (prev ? { ...prev, visit_reason: visitReason } : null));
      setEditingEHR(undefined);
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewData = async (formData: any, dataType: string) => {
    if (!ehr || !doctorProfile || !ehr.healthcare_facilities) {
      toast({ title: "Error", description: "Critical data missing.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    let tableName = "";
    switch (dataType) {
      case "Diagnosis": tableName = "diagnosis"; break;
      case "Prescription": tableName = "prescriptions"; break;
      case "Examination": tableName = "examinations"; break;
      case "Physical Examination": tableName = "physical_examinations"; break;
      case "Note": tableName = "doctor_notes"; break;
      case "Vaccination": tableName = "vaccinations"; break;
      default:
        toast({ title: "Submission Failed", description: `Invalid data type: ${dataType}`, variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    const payload = { ...formData, ehr_id: ehr.ehr_id, doctor_id: doctorProfile.doctor_id, healthcare_facility_id: ehr.healthcare_facilities.healthcare_facility_id };
    try {
      const { data: newRecord, error } = await supabase.from(tableName).insert(payload).select('*, doctors(full_name)').single();
      if (error) throw error;
      setEhr((prev) => {
        if (!prev) return null;
        type EhrArrayKey = 'diagnosis' | 'prescriptions' | 'examinations' | 'physical_examinations' | 'doctor_notes' | 'vaccinations';
        const keyMap: { [key: string]: EhrArrayKey } = { "Diagnosis": "diagnosis", "Prescription": "prescriptions", "Examination": "examinations", "Physical Examination": "physical_examinations", "Note": "doctor_notes", "Vaccination": "vaccinations" };
        const ehrKey = keyMap[dataType];
        const existingRecords = prev[ehrKey] || [];
        return { ...prev, [ehrKey]: [...existingRecords, newRecord] };
      });
      toast({ title: "Success!", description: `${dataType} has been added successfully.` });
      setAddingDataType(null);
      setIsDiagnosisDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Submission Failed", description: `Could not add ${dataType}: ${err.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDownload = () => {
    if (ehr && ehr.patients) {
      toast({ title: "Generating PDF...", description: "Your record is being prepared." });
      generateEHR_PDF(ehr.patients, ehr);
    }
    setShowDownloadDialog(false);
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><p className="ml-4 text-lg">Loading Medical Record...</p></div>;
  if (error || !ehr || !ehr.patients) return <div className="flex h-screen w-full items-center justify-center p-4"><Alert variant="destructive" className="max-w-md"><AlertTitle>Error Fetching Record</AlertTitle><AlertDescription>{error || "The requested health record could not be found."}</AlertDescription></Alert></div>;

  const { patients: patient } = ehr;
  const canEdit = ehr?.doctor_id === doctorProfile?.doctor_id;

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="EHR Details" />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Patient's EHR List
            </Button>
          </div>

          <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{patient.full_name}</CardTitle>
                <CardDescription>Patient ID: {patient.patient_id}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 border-b pb-2">Demographics</h4>
                        <div>
                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                            <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-medium">{(() => { const birthDate = new Date(patient.date_of_birth); const today = new Date(); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; } return age; })()} years old</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Gender</p>
                            <p className="font-medium">{patient.gender}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 border-b pb-2">Contact</h4>
                        <div>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                            <p className="font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" />{patient.users?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" />{patient.phone_number || "N/A"}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 border-b pb-2">Known Allergies</h4>
                        <div className="flex flex-wrap gap-2">
                            {patient.patient_allergies.length > 0 ? (
                                patient.patient_allergies.map((allergy, i) => (<Badge key={i} variant="destructive">{allergy.allergy_type.name}</Badge>))
                            ) : (<p className="text-sm text-muted-foreground">No known allergies recorded.</p>)}
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-">Visit Details: {ehr.healthcare_facilities?.name || "N/A"}</CardTitle>
                  <CardDescription>Date: {new Date(ehr.created_at).toLocaleString()} | Attending: {ehr.doctors?.full_name || "N/A"}</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingEHR(ehr)} disabled={!canEdit} title={!canEdit ? "You can only edit records you created" : "Edit Visit Reason"}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Visit Reason
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm"><strong className="font-medium">Reason for Visit:</strong>{" "}{ehr.visit_reason}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="diagnosis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              <TabsTrigger value="prescriptions">Medications</TabsTrigger>
              <TabsTrigger value="examinations">Lab Results</TabsTrigger>
              <TabsTrigger value="physical_examinations">Physical Exam</TabsTrigger>
              <TabsTrigger value="doctor_notes">Doctor's Notes</TabsTrigger>
              <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="diagnosis" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Diagnosis</CardTitle>
                  <Button size="sm" onClick={() => setIsDiagnosisDialogOpen(true)} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.diagnosis.length > 0 ? (
                    ehr.diagnosis.map((d: any) => (
                      <div key={d.diagnosis_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{d.diagnosis_description}</h4>
                        <p className="text-sm mt-1 text-gray-700">{d.treatment_plan}</p>
                        <p className="text-xs text-muted-foreground mt-2">By {d.doctors.full_name}</p>
                      </div>
                    ))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No diagnosis records for this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prescriptions" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Prescriptions</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Prescription")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.prescriptions.length > 0 ? (
                    ehr.prescriptions.map((p: any) => (
                      <div key={p.prescription_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{p.medication_name}</h4>
                        <p className="text-sm text-gray-700">{p.dosage} - {p.duration}</p>
                        <p className="text-sm text-muted-foreground">{p.instruction}</p>
                      </div>
                    ))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No prescriptions for this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Lab & Examinations</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Examination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.examinations.length > 0 ? (
                    ehr.examinations.map((e: any) => (
                      <div key={e.examination_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{e.examination_name}{" "}<span className="text-sm font-normal text-muted-foreground">({e.examination_type})</span></h4>
                        <p className="text-sm text-gray-700">{e.note}</p>
                      </div>
                    ))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No examinations for this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical_examinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Physical Examination</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Physical Examination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {ehr.physical_examinations.length > 0 ? (
                    ehr.physical_examinations.map((p: any) => (
                      <div key={p.physical_examination_id} className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><strong className="block">Heart Rate</strong>{p.heart_rate} bpm</div>
                          <div><strong className="block">Blood Pressure</strong>{p.blood_pressure} mmHg</div>
                          <div><strong className="block">Temperature</strong>{p.temperature} °C</div>
                          <div><strong className="block">Oxygen Sat.</strong>{p.oxygen_saturation} %</div>
                        </div>
                        <div className="pt-4 mt-4 border-t"><strong className="block">Findings:</strong><p className="text-muted-foreground">{p.findings}</p></div>
                      </div>
                    ))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No physical exam recorded for this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="doctor_notes" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Doctor's Notes</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Note")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.doctor_notes.length > 0 ? (
                    ehr.doctor_notes.map((n: any) => (<p key={n.doctor_note_id} className="text-sm text-gray-700 border-l-4 pl-4">{n.note}</p>))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No notes for this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vaccinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Vaccinations</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Vaccination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.vaccinations.length > 0 ? (
                    ehr.vaccinations.map((v: any) => (
                      <div key={v.vaccination_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{v.vaccine_name}{" "}<span className="text-sm font-normal text-muted-foreground">({v.vaccine_type})</span></h4>
                        <p className="text-sm text-muted-foreground">Dose: {v.dose_number}</p>
                      </div>
                    ))
                  ) : (<p className="text-sm text-center text-muted-foreground py-8">No vaccinations administered during this visit.</p>)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </SidebarInset>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
            <DialogDescription>This will generate a PDF of the selected health record. Do you want to continue?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDownload}>Confirm & Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingEHR !== undefined} onOpenChange={(isOpen) => !isOpen && setEditingEHR(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Visit Reason</DialogTitle>
            <DialogDescription>Update the primary reason for this patient encounter.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateVisitReason} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="visit_reason">Reason for Visit</Label>
              <Textarea id="visit_reason" name="visit_reason" defaultValue={editingEHR?.visit_reason ?? ""} required className="mt-2"/>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditingEHR(undefined)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)} Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AddDiagnosisDialog
        open={isDiagnosisDialogOpen}
        onOpenChange={setIsDiagnosisDialogOpen}
        onSubmit={handleAddNewData}
        isSubmitting={isSubmitting}
        visitReason={ehr?.visit_reason || ""}
        diagnosisHistory={diagnosisHistory}
      />
      <AddEhrDataDialog
        dataType={addingDataType}
        open={addingDataType !== null}
        onOpenChange={(isOpen) => !isOpen && setAddingDataType(null)}
        onSubmit={handleAddNewData}
        isSubmitting={isSubmitting}
      />
    </SidebarProvider>
  );
}
