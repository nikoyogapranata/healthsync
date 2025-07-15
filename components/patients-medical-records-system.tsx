//components\patients-medical-records-system.tsx

"use client"
import { useState, useEffect, useRef } from "react" // Import useRef
import Link from "next/link"
import Image from "next/image"

// PDF Generation Imports
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// --- Icon Imports ---
import {
  FileText,
  Pill,
  Microscope,
  Syringe,
  Download,
  Calendar,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Home,
  Settings,
  User,
  Loader2,
} from "lucide-react"

// --- Reusable Layout Components ---
import { Header } from "./ui/header"
import { Footer } from "./ui/footer"

// --- Sidebar UI Components ---
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
} from "@/components/ui/sidebar"

// --- UI Components ---
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/utils/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

// --- TypeScript Interfaces ---
interface Patient {
  patient_id: string
  full_name: string
  date_of_birth: string
  gender: string
  blood_type: string
  phone_number: string
  address: string
  users: { email: string } | null
  patient_allergies: { reaction: string; severity: string, allergy_type: { name: string } }[]
}

interface EHRRecord {
  ehr_id: string
  created_at: string
  updated_at: string
  healthcare_facilities: { name: string } | null
  doctors: { full_name: string } | null
  diagnosis: any[]
  prescriptions: any[]
  examinations: any[]
  physical_examinations: any[]
  doctor_notes: any[]
  vaccinations: any[]
}


// --- PDF GENERATION LOGIC ---
const generateEHR_PDF = (patient: Patient, ehr: EHRRecord) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 15; // Vertical position tracker

  // Helper function to add a section with a title
  const addSection = (title: string, content: () => void) => {
    if (y > pageHeight - 40) { // Check for page break before adding new section
      doc.addPage();
      y = 15;
    }
    doc.setFontSize(16);
    doc.text(title, 14, y);
    y += 8;
    doc.setFontSize(11);
    content();
  };

  // --- PDF Header ---
  doc.setFontSize(22);
  doc.text("HealthSync Medical Record Summary", 14, y);
  y += 10;
  
  // --- Patient Information ---
  addSection("Patient Information", () => {
    autoTable(doc, {
      startY: y,
      body: [
        ['Name', patient.full_name],
        ['Date of Birth', new Date(patient.date_of_birth).toLocaleDateString()],
        ['Gender', patient.gender],
        ['Contact', `${patient.phone_number} | ${patient.users?.email}`],
        ['Address', patient.address],
      ],
      theme: 'grid',
      styles: { cellPadding: 2, fontSize: 10 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  });

  // --- Visit Information ---
  addSection("Visit Information", () => {
     autoTable(doc, {
      startY: y,
      body: [
        ['Facility', ehr.healthcare_facilities?.name || 'N/A'],
        ['Attending Doctor', ehr.doctors?.full_name || 'N/A'],
        ['Date of Visit', new Date(ehr.created_at).toLocaleDateString()],
      ],
      theme: 'grid',
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  });
  
  // --- Diagnoses Section ---
  if(ehr.diagnosis.length > 0) {
    addSection("Diagnoses", () => {
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Diagnosis', 'Doctor', 'Treatment Plan']],
        body: ehr.diagnosis.map((d: any) => [
          new Date(d.created_at).toLocaleDateString(),
          d.diseases?.name || d.diagnosis_description, // This line is changed
          d.doctors.full_name,
          d.treatment_plan
        ]),
        theme: 'striped',
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // --- Medications Section ---
  if(ehr.prescriptions.length > 0) {
    addSection("Medications Prescribed", () => {
       autoTable(doc, {
        startY: y,
        head: [['Date', 'Medication', 'Dosage', 'Instructions']],
        body: ehr.prescriptions.map((p: any) => [
          new Date(p.created_at).toLocaleDateString(),
          p.medication_name,
          p.dosage,
          p.instruction
        ]),
        theme: 'striped',
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // --- Examinations Section ---
  if(ehr.examinations.length > 0) {
    addSection("Examinations & Lab Results", () => {
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Test Name', 'Type', 'Note']],
        body: ehr.examinations.map((e: any) => [
          new Date(e.created_at).toLocaleDateString(),
          e.examination_name,
          e.examination_type,
          e.note || 'N/A'
        ]),
        theme: 'striped',
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // --- Physical Exam Section ---
  if(ehr.physical_examinations.length > 0) {
     const exam = ehr.physical_examinations[0];
     addSection("Physical Examination", () => {
      autoTable(doc, {
        startY: y,
        body: [
          [{content: 'Vitals', colSpan: 4, styles: { fontStyle: 'bold' }}],
          ['Heart Rate', `${exam.heart_rate} bpm`, 'Blood Pressure', `${exam.blood_pressure} mmHg`],
          ['Temperature', `${exam.temperature} °C`, 'Oxygen Saturation', `${exam.oxygen_saturation} %`],
          [{content: `Observations: ${exam.general_observations}`, colSpan: 4}],
          [{content: `Findings: ${exam.findings}`, colSpan: 4}],
        ],
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // --- Final step: Save the PDF ---
  doc.save(`HealthSync_Record_${patient.full_name.replace(' ', '_')}_${new Date(ehr.created_at).toLocaleDateString('en-CA')}.pdf`);
}


const navigationItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Appointments", url: "/appointments", icon: Calendar },
    { title: "Medical Records", url: "/patients-medical-records", icon: FileText, isActive: true },
    { title: "Ask AI", url: "/ask-ai", icon: MessageCircle },
    { title: "Settings", url: "/settings", icon: Settings },
];

function PatientSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                  <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-lg text-foreground">HealthSync</span>
                  <span className="text-xs text-muted-foreground font-medium">Patient Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">
            NAVIGATION
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
  )
}

// --- Main Patient Medical Records Component ---
export function PatientMedicalRecordsSystem() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ehrRecords, setEhrRecords] = useState<EHRRecord[]>([]);
  const [selectedEHR, setSelectedEHR] = useState<EHRRecord | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select(`*, users ( email ), patient_allergies ( reaction, severity, allergy_type ( name ) )`)
          .eq('user_id', user.id)
          .single();
        
        if (patientError) throw new Error("Could not fetch patient profile.");
        setPatient(patientData as Patient);

        const { data: ehrData, error: ehrError } = await supabase
          .from('ehr')
          .select(`*, healthcare_facilities ( name ), doctors ( full_name ), diagnosis ( *, doctors ( full_name ), diseases ( name, icd_10_code ) ), prescriptions ( *, doctors ( full_name ) ), examinations ( *, doctors ( full_name ) ), physical_examinations ( *, doctors ( full_name ) ), doctor_notes ( *, doctors ( full_name ) ), vaccinations ( *, doctors ( full_name ) )`)
          .eq('patient_id', patientData.patient_id)
          .order('created_at', { ascending: false });

        if (ehrError) throw new Error("Could not fetch health records.");
        
        setEhrRecords(ehrData as EHRRecord[]);
        if (ehrData && ehrData.length > 0) {
          setSelectedEHR(ehrData[0] as EHRRecord);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalData();
  }, [supabase]);

  const handleEHRSelect = (ehr: EHRRecord) => {
    setSelectedEHR(ehr)
    setActiveTab("overview")
  }

  // --- DOWNLOAD HANDLERS ---
  const initiateDownload = () => {
    if (!selectedEHR) {
      toast({ title: "No Record Selected", description: "Please select a health record to download.", variant: "destructive" });
      return;
    }
    setShowDownloadDialog(true);
  }

  const handleConfirmDownload = () => {
     if (patient && selectedEHR) {
        toast({ title: "Generating PDF...", description: "Your record is being prepared." });
        generateEHR_PDF(patient, selectedEHR);
     }
     setShowDownloadDialog(false);
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Loading Medical Records...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Error Fetching Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <PatientSidebar />
        <SidebarInset className="flex flex-col">
          <Header pageTitle="My Medical Records" />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
                  <p className="mt-2 text-gray-600">View and manage your health information</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={initiateDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Selected Record
                  </Button>
                </div>
              </div>

              {/* Patient Info Card */}
              <Card className="border-l-4 border-l-[#3FB6F6]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="font-medium">{patient?.full_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p>{patient ? new Date(patient.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="capitalize">{patient?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Blood Type</p>
                        <p>{patient?.blood_type || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {patient?.phone_number || 'N/A'}
                        </p>
                      </div>
                       <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {patient?.users?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                   <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Known Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {patient?.patient_allergies && patient.patient_allergies.length > 0 ? patient.patient_allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {allergy.allergy_type.name}
                          </Badge>
                        )) : <p className="text-sm text-gray-500">No known allergies.</p>}
                      </div>
                    </div>
                </CardContent>
              </Card>

              {/* Medical Records Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>My Health Records</CardTitle>
                  <CardDescription>Select a healthcare facility visit to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ehrRecords.map((ehr) => (
                      <Card
                        key={ehr.ehr_id}
                        className={`cursor-pointer transition-all ${
                          selectedEHR?.ehr_id === ehr.ehr_id ? "ring-2 ring-[#3FB6F6] bg-blue-50" : "hover:shadow-md"
                        }`}
                        onClick={() => handleEHRSelect(ehr)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{ehr.healthcare_facilities?.name || 'Unknown Facility'}</h3>
                                <p className="text-sm text-gray-600">{ehr.doctors?.full_name || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Visit Date: {new Date(ehr.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                              <span>{ehr.diagnosis.length} Diagnoses</span>
                              <span>{ehr.prescriptions.length} Meds</span>
                              <span>{ehr.examinations.length} Exams</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected EHR Details */}
              {selectedEHR && (
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Visit Details for {selectedEHR.healthcare_facilities?.name}
                      </CardTitle>
                      <CardDescription>
                        Visit Date: {new Date(selectedEHR.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                        <TabsTrigger value="prescriptions">Medications</TabsTrigger>
                        <TabsTrigger value="examinations">Examinations</TabsTrigger>
                        <TabsTrigger value="physical-examinations">Physical Exam</TabsTrigger>
                        <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
                      </TabsList>
                      
                      {/* --- TABS CONTENT --- */}
                       <TabsContent value="overview" className="space-y-4 pt-4">
                          {/* Summary Cards */}
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Diagnoses</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedEHR.diagnosis.length}
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Medications</CardTitle>
                                <Pill className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedEHR.prescriptions.length}
                                </div>
                              </CardContent>
                            </Card>
                             <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Examinations</CardTitle>
                                <Microscope className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedEHR.examinations.length}
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Physical Exam</CardTitle>
                                <HeartPulse className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedEHR.physical_examinations.length > 0 ? "Done" : "None"}
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
                                <Syringe className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedEHR.vaccinations.length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  vaccinations this visit
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          {/* Doctor's Notes and Diagnoses Summary */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                              <CardHeader>
                                <CardTitle>Doctor's Visit Note</CardTitle>
                                <CardDescription>
                                  Note from {selectedEHR.doctor_notes[0]?.doctors.full_name || 'the attending doctor'}.
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {selectedEHR.doctor_notes[0]?.note || "No general visit note was recorded for this encounter."}
                                </p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle>Diagnoses This Visit</CardTitle>
                                <CardDescription>
                                  A summary of diagnoses from this visit.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-4">
                                {selectedEHR.diagnosis.length > 0 ? (
                                  selectedEHR.diagnosis.slice(0, 3).map((diag: any) => (
                                    <div key={diag.diagnosis_id} className="flex items-center space-x-4 rounded-md border p-4">
                                      <FileText className="h-6 w-6" />
                                      <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                          {diag.diseases?.name || diag.diagnosis_description}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          By {diag.doctors.full_name}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No diagnoses were recorded.</p>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      
                      <TabsContent value="diagnoses" className="space-y-4 pt-4">
                        {selectedEHR.diagnosis.map((item: any) => (
                          <Card key={item.diagnosis_id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-lg">{item.diseases?.name || item.diagnosis_description}</h4>
                                  <p className="text-sm text-gray-600">{item.doctors.full_name}</p>
                                </div>
                                <p className="text-sm font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-700">Treatment:</strong> {item.treatment_plan}</p>
                                <p><strong className="font-medium text-gray-700">Symptoms:</strong> {item.symptoms}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="prescriptions" className="space-y-4 pt-4">
                        {selectedEHR.prescriptions.map((item: any) => (
                            <Card key={item.prescription_id}>
                                <CardContent className="p-4 grid gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{item.medication_name}</h4>
                                            <p className="text-sm text-gray-600">{item.doctors.full_name}</p>
                                        </div>
                                        <p className="text-sm font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div><strong className="block font-medium">Dosage:</strong> {item.dosage}</div>
                                        <div><strong className="block font-medium">Duration:</strong> {item.duration}</div>
                                        <div className="col-span-2 md:col-span-1"><strong className="block font-medium">Instruction:</strong> {item.instruction}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="examinations" className="space-y-4 pt-4">
                        {selectedEHR.examinations.map((item: any) => (
                            <Card key={item.examination_id}>
                                <CardContent className="p-4 grid gap-2">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{item.examination_name}</h4>
                                            <p className="text-sm text-gray-600">{item.doctors.full_name}</p>
                                        </div>
                                        <p className="text-sm font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p><strong className="font-medium">Type:</strong> {item.examination_type}</p>
                                    <p><strong className="font-medium">Note:</strong> {item.note || 'N/A'}</p>
                                    {item.result_file && <Button variant="outline" size="sm" asChild><Link href={item.result_file} target="_blank">View File</Link></Button>}
                                </CardContent>
                            </Card>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="physical-examinations" className="space-y-4 pt-4">
                        {selectedEHR.physical_examinations.map((item: any) => (
                          <Card key={item.physical_examination_id}>
                            <CardHeader>
                                <CardTitle className="text-lg">Physical Examination</CardTitle>
                                <CardDescription>{new Date(item.created_at).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                                <div><strong className="block font-medium">Heart Rate:</strong> {item.heart_rate} bpm</div>
                                <div><strong className="block font-medium">Blood Pressure:</strong> {item.blood_pressure} mmHg</div>
                                <div><strong className="block font-medium">Temperature:</strong> {item.temperature} °C</div>
                                <div><strong className="block font-medium">Respiratory Rate:</strong> {item.respiratory_rate} bpm</div>
                                <div><strong className="block font-medium">Oxygen Saturation:</strong> {item.oxygen_saturation} %</div>
                                <div className="col-span-full"><strong className="block font-medium">General Observations:</strong> {item.general_observations}</div>
                                <div className="col-span-full"><strong className="block font-medium">Findings:</strong> {item.findings}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="vaccinations" className="space-y-4 pt-4">
                        {selectedEHR.vaccinations.map((item: any) => (
                            <Card key={item.vaccination_id}>
                                <CardContent className="p-4 grid gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{item.vaccine_name}</h4>
                                            <p className="text-sm text-gray-600">{item.vaccine_type}</p>
                                        </div>
                                        <p className="text-sm font-medium">{new Date(item.date_given).toLocaleDateString()}</p>
                                    </div>
                                    <div><strong className="font-medium">Dose:</strong> {item.dose_number}</div>
                                    {item.next_dose_date && <div><strong className="font-medium">Next Dose:</strong> {new Date(item.next_dose_date).toLocaleDateString()}</div>}
                                </CardContent>
                            </Card>
                        ))}
                      </TabsContent>

                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
          
          <Footer />
        </SidebarInset>
      </SidebarProvider>
      
      {/* Download Confirmation Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Download</DialogTitle>
                <DialogDescription>
                    This will generate a PDF of the selected health record from {selectedEHR?.healthcare_facilities?.name || "the selected facility"}. Do you want to continue?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>Cancel</Button>
                <Button onClick={handleConfirmDownload}>Confirm & Download</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}