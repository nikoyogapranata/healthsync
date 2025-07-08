"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

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
  Activity,
  Clock,
  Bell,
  User,
  Shield,
  Home,
  Settings,
  HelpCircle,
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

// --- TypeScript Interfaces ---
interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  bloodType: string
  allergies: string[]
  phone: string
  email: string
  address: string
  insuranceStatus: string
  chronicDiseases: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

interface EHRRecord {
  id: string
  patientId: string
  facilityId: string
  facilityName: string
  createdDate: string
  lastUpdated: string
  status: "active" | "archived" | "transferred"
  primaryDoctor: string
  diagnoses: Diagnosis[]
  prescriptions: Prescription[]
  labResults: LabResult[]
  medicalNotes: MedicalNote[]
  vaccinations: Vaccination[]
}

interface Diagnosis {
  id: string
  date: string
  time: string
  doctor: string
  diagnosis: string
  treatment: string
  notes: string
  followUpRequired: boolean
  icd10Code?: string
}

interface Prescription {
  id: string
  date: string
  time: string
  doctor: string
  medication: string
  dosage: string
  duration: string
  instructions: string
  status: "active" | "completed" | "discontinued"
}

interface LabResult {
  id: string
  date: string
  time: string
  type: "laboratory" | "radiology" | "pathology"
  testName: string
  result: string
  normalRange?: string
  notes: string
  file?: string
  doctor: string
  facility: string
  status: "normal" | "abnormal" | "critical"
}

interface MedicalNote {
  id: string
  date: string
  time: string
  doctor: string
  note: string
  facility: string
  category: "consultation" | "procedure" | "observation" | "discharge"
}

interface Vaccination {
  id: string
  date: string
  time: string
  vaccineType: string
  vaccineName: string
  dose: string
  location: string
  administrator: string
  batchNumber?: string
  nextDueDate?: string
}

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  facility: string
  type: string
  status: "scheduled" | "completed" | "cancelled"
}

// Navigation items
const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, isActive: true },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Medical Records", url: "/patients-medical-records", icon: FileText },
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
                href="/patient-dashboard"
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
            My Health
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
  const [selectedEHR, setSelectedEHR] = useState<EHRRecord | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // --- Sample Patient Data ---
  const currentPatient: Patient = {
    id: "P001",
    name: "John Smith",
    dateOfBirth: "April 25, 1989",
    gender: "Male",
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    phone: "+1-555-0123",
    email: "john.smith@email.com",
    address: "123 Main Street, New York, NY 10001",
    insuranceStatus: "Active",
    chronicDiseases: ["Hypertension", "Type 2 Diabetes"],
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1-555-0124",
    },
  }

  const ehrRecords: EHRRecord[] = [
    {
      id: "EHR001",
      patientId: "P001",
      facilityId: "F001",
      facilityName: "HealthSync General Hospital",
      createdDate: "2023-01-15",
      lastUpdated: "2023-12-15",
      status: "active",
      primaryDoctor: "Dr. Michael Brown, MD",
      diagnoses: [
        {
          id: "D001",
          date: "2023-12-15",
          time: "14:30",
          doctor: "Dr. Michael Brown, MD",
          diagnosis: "Type 2 Diabetes Mellitus",
          treatment: "Metformin 500mg twice daily, dietary counseling",
          notes: "Patient needs monthly follow-up for blood glucose monitoring",
          followUpRequired: true,
          icd10Code: "E11.9",
        },
        {
          id: "D002",
          date: "2023-10-20",
          time: "10:15",
          doctor: "Dr. Sarah Wilson, MD",
          diagnosis: "Essential Hypertension",
          treatment: "Lisinopril 10mg daily, lifestyle modifications",
          notes: "Blood pressure well controlled with current medication",
          followUpRequired: true,
          icd10Code: "I10",
        },
      ],
      prescriptions: [
        {
          id: "RX001",
          date: "2023-12-15",
          time: "14:45",
          doctor: "Dr. Michael Brown, MD",
          medication: "Metformin 500mg",
          dosage: "Twice daily with meals",
          duration: "90 days",
          instructions: "Take with breakfast and dinner",
          status: "active",
        },
        {
          id: "RX002",
          date: "2023-10-20",
          time: "10:30",
          doctor: "Dr. Sarah Wilson, MD",
          medication: "Lisinopril 10mg",
          dosage: "Once daily",
          duration: "90 days",
          instructions: "Take in the morning",
          status: "active",
        },
      ],
      labResults: [
        {
          id: "LAB001",
          date: "2023-12-15",
          time: "09:00",
          type: "laboratory",
          testName: "Fasting Blood Glucose",
          result: "145 mg/dL",
          normalRange: "70-100 mg/dL",
          notes: "Elevated, consistent with diabetes diagnosis",
          doctor: "Dr. Michael Brown, MD",
          facility: "HealthSync General Hospital",
          status: "abnormal",
        },
        {
          id: "LAB002",
          date: "2023-12-15",
          time: "09:00",
          type: "laboratory",
          testName: "HbA1c",
          result: "7.8%",
          normalRange: "<7.0%",
          notes: "Diabetes control needs improvement",
          doctor: "Dr. Michael Brown, MD",
          facility: "HealthSync General Hospital",
          status: "abnormal",
        },
      ],
      medicalNotes: [
        {
          id: "NOTE001",
          date: "2023-12-15",
          time: "14:50",
          doctor: "Dr. Michael Brown, MD",
          note: "Patient reports increased thirst and frequent urination. Discussed importance of medication compliance and dietary modifications.",
          facility: "HealthSync General Hospital",
          category: "consultation",
        },
      ],
      vaccinations: [
        {
          id: "VAC001",
          date: "2023-10-01",
          time: "11:00",
          vaccineType: "Influenza",
          vaccineName: "Fluzone Quadrivalent",
          dose: "Annual",
          location: "HealthSync General Hospital",
          administrator: "Nurse Jennifer Adams, RN",
          batchNumber: "FL2023-001",
          nextDueDate: "2024-10-01",
        },
      ],
    },
    {
      id: "EHR002",
      patientId: "P001",
      facilityId: "F002",
      facilityName: "City Medical Center",
      createdDate: "2022-06-10",
      lastUpdated: "2023-01-10",
      status: "transferred",
      primaryDoctor: "Dr. Robert Davis, MD",
      diagnoses: [
        {
          id: "D003",
          date: "2022-11-15",
          time: "09:45",
          doctor: "Dr. Robert Davis, MD",
          diagnosis: "Upper Respiratory Infection",
          treatment: "Amoxicillin 500mg three times daily, rest",
          notes: "Patient advised to drink plenty of fluids and rest",
          followUpRequired: false,
          icd10Code: "J06.9",
        },
      ],
      prescriptions: [
        {
          id: "RX003",
          date: "2022-11-15",
          time: "10:00",
          doctor: "Dr. Robert Davis, MD",
          medication: "Amoxicillin 500mg",
          dosage: "Three times daily",
          duration: "7 days",
          instructions: "Take with food, complete full course",
          status: "completed",
        },
      ],
      labResults: [],
      medicalNotes: [],
      vaccinations: [],
    },
  ]

  const upcomingAppointments: Appointment[] = [
    {
      id: "APT001",
      date: "2024-01-20",
      time: "10:00 AM",
      doctor: "Dr. Michael Brown, MD",
      facility: "HealthSync General Hospital",
      type: "Follow-up Consultation",
      status: "scheduled",
    },
    {
      id: "APT002",
      date: "2024-02-15",
      time: "2:30 PM",
      doctor: "Dr. Sarah Wilson, MD",
      facility: "HealthSync General Hospital",
      type: "Blood Pressure Check",
      status: "scheduled",
    },
  ]

  // Set initial EHR to the most recent active one
  useState(() => {
    const activeEHRs = ehrRecords.filter((ehr) => ehr.status === "active")
    if (activeEHRs.length > 0) {
      setSelectedEHR(
        activeEHRs.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0],
      )
    }
  })

  // --- Handlers ---
  const handleEHRSelect = (ehr: EHRRecord) => {
    setSelectedEHR(ehr)
    setActiveTab("overview")
  }

  const handleRequestRecords = () => {
    toast({
      title: "Request Submitted",
      description: "Your medical records request has been submitted successfully",
      duration: 3000,
    })
    setShowRequestDialog(false)
  }

  const handleDownloadRecord = () => {
    toast({
      title: "Download Started",
      description: "Your medical records are being prepared for download",
      duration: 3000,
    })
  }

  // --- Helper Functions ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "transferred":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      case "abnormal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "discontinued":
        return "bg-red-100 text-red-800 border-red-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // --- Main Render Logic ---
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <PatientSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header */}
          <Header pageTitle="My Medical Records" />

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="space-y-8">
              {/* Welcome Header */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
                  <p className="mt-2 text-gray-600">View and manage your health information</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRequestDialog(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Request Records
                  </Button>
                  <Button variant="outline" onClick={handleDownloadRecord}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
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
                        <p className="font-medium">{currentPatient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p>{currentPatient.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p>{currentPatient.gender}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Blood Type</p>
                        <p>{currentPatient.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {currentPatient.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {currentPatient.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          {currentPatient.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Insurance Status</p>
                        <Badge className={getStatusColor(currentPatient.insuranceStatus.toLowerCase())}>
                          {currentPatient.insuranceStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {currentPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {currentPatient.chronicDiseases.map((disease, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Records Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>My Health Records</CardTitle>
                  <CardDescription>Select a healthcare facility to view your medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ehrRecords.map((ehr) => (
                      <Card
                        key={ehr.id}
                        className={`cursor-pointer transition-all ${
                          selectedEHR?.id === ehr.id ? "ring-2 ring-[#3FB6F6] bg-blue-50" : "hover:shadow-md"
                        }`}
                        onClick={() => handleEHRSelect(ehr)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{ehr.facilityName}</h3>
                                <p className="text-sm text-gray-600">{ehr.primaryDoctor}</p>
                              </div>
                              <Badge className={getStatusColor(ehr.status)}>{ehr.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Created: {ehr.createdDate}</p>
                              <p>Last Updated: {ehr.lastUpdated}</p>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{ehr.diagnoses.length} Diagnoses</span>
                              <span>{ehr.prescriptions.length} Prescriptions</span>
                              <span>{ehr.labResults.length} Lab Results</span>
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
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {selectedEHR.facilityName}
                        </CardTitle>
                        <CardDescription>
                          Primary Doctor: {selectedEHR.primaryDoctor} | Status:{" "}
                          <Badge className={`ml-2 ${getStatusColor(selectedEHR.status)}`}>{selectedEHR.status}</Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownloadRecord}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                        <TabsTrigger value="prescriptions">Medications</TabsTrigger>
                        <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                        <TabsTrigger value="notes">Visit Notes</TabsTrigger>
                        <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Total Diagnoses</p>
                                  <p className="text-2xl font-bold">{selectedEHR.diagnoses.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-[#3FB6F6]" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Active Medications</p>
                                  <p className="text-2xl font-bold">
                                    {selectedEHR.prescriptions.filter((p) => p.status === "active").length}
                                  </p>
                                </div>
                                <Pill className="h-8 w-8 text-[#34D399]" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Lab Results</p>
                                  <p className="text-2xl font-bold">{selectedEHR.labResults.length}</p>
                                </div>
                                <Microscope className="h-8 w-8 text-[#F59E0B]" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Vaccinations</p>
                                  <p className="text-2xl font-bold">{selectedEHR.vaccinations.length}</p>
                                </div>
                                <Syringe className="h-8 w-8 text-[#8B5CF6]" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Recent Diagnoses</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {selectedEHR.diagnoses.slice(0, 3).map((diagnosis) => (
                                  <div key={diagnosis.id} className="border-l-2 border-[#3FB6F6] pl-3">
                                    <p className="font-medium">{diagnosis.diagnosis}</p>
                                    <p className="text-sm text-gray-600">{diagnosis.doctor}</p>
                                    <p className="text-xs text-gray-500">{diagnosis.date}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Current Medications</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {selectedEHR.prescriptions
                                  .filter((p) => p.status === "active")
                                  .slice(0, 3)
                                  .map((prescription) => (
                                    <div key={prescription.id} className="border-l-2 border-[#34D399] pl-3">
                                      <p className="font-medium">{prescription.medication}</p>
                                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                                      <p className="text-xs text-gray-500">{prescription.instructions}</p>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="diagnoses" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {selectedEHR.diagnoses.map((diagnosis) => (
                            <Card key={diagnosis.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-lg">{diagnosis.diagnosis}</h4>
                                      <p className="text-sm text-gray-600">{diagnosis.doctor}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{diagnosis.date}</p>
                                      <p className="text-xs text-gray-500">{diagnosis.time}</p>
                                    </div>
                                  </div>
                                  {diagnosis.icd10Code && <Badge variant="outline">{diagnosis.icd10Code}</Badge>}
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                                    <p className="text-sm text-gray-600">{diagnosis.treatment}</p>
                                  </div>
                                  {diagnosis.notes && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                                      <p className="text-sm text-gray-600">{diagnosis.notes}</p>
                                    </div>
                                  )}
                                  {diagnosis.followUpRequired && (
                                    <Alert className="border-yellow-200 bg-yellow-50">
                                      <Clock className="h-4 w-4" />
                                      <AlertDescription>Follow-up appointment required</AlertDescription>
                                    </Alert>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="prescriptions" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {selectedEHR.prescriptions.map((prescription) => (
                            <Card key={prescription.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-lg">{prescription.medication}</h4>
                                      <p className="text-sm text-gray-600">{prescription.doctor}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{prescription.date}</p>
                                      <Badge className={getStatusColor(prescription.status)}>
                                        {prescription.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700">Dosage:</p>
                                      <p className="text-gray-600">{prescription.dosage}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Duration:</p>
                                      <p className="text-gray-600">{prescription.duration}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Instructions:</p>
                                      <p className="text-gray-600">{prescription.instructions}</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="lab-results" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {selectedEHR.labResults.map((result) => (
                            <Card key={result.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-lg">{result.testName}</h4>
                                      <p className="text-sm text-gray-600">{result.doctor}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{result.date}</p>
                                      <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">Result:</p>
                                      <p className="text-lg font-semibold">{result.result}</p>
                                    </div>
                                    {result.normalRange && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-700">Normal Range:</p>
                                        <p className="text-sm text-gray-600">{result.normalRange}</p>
                                      </div>
                                    )}
                                  </div>
                                  {result.notes && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                                      <p className="text-sm text-gray-600">{result.notes}</p>
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    <p>
                                      {result.facility} | {result.date} at {result.time}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="notes" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {selectedEHR.medicalNotes.map((note) => (
                            <Card key={note.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <Badge variant="outline">{note.category}</Badge>
                                      <p className="font-medium mt-2">{note.doctor}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {note.date} at {note.time}
                                    </p>
                                  </div>
                                  <p className="text-gray-700">{note.note}</p>
                                  <p className="text-xs text-gray-500">{note.facility}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="vaccinations" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {selectedEHR.vaccinations.map((vaccination) => (
                            <Card key={vaccination.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-lg">{vaccination.vaccineName}</h4>
                                      <p className="text-sm text-gray-600">{vaccination.vaccineType}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{vaccination.date}</p>
                                      <p className="text-xs text-gray-500">{vaccination.time}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700">Dose:</p>
                                      <p className="text-gray-600">{vaccination.dose}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Location:</p>
                                      <p className="text-gray-600">{vaccination.location}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Administrator:</p>
                                      <p className="text-gray-600">{vaccination.administrator}</p>
                                    </div>
                                    {vaccination.nextDueDate && (
                                      <div>
                                        <p className="font-medium text-gray-700">Next Due:</p>
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                          {vaccination.nextDueDate}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  {vaccination.batchNumber && (
                                    <p className="text-xs text-gray-500">Batch: {vaccination.batchNumber}</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Request Records Dialog */}
              <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Medical Records</DialogTitle>
                    <DialogDescription>
                      Request copies of your medical records from healthcare providers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        You can request copies of your medical records for personal use, sharing with other healthcare
                        providers, or for insurance purposes.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">What records would you like?</p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Complete medical history</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Lab results</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Imaging studies</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Vaccination records</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]" onClick={handleRequestRecords}>
                      Submit Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
