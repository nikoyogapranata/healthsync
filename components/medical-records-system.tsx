"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Icon Imports ---
import {
  FileText,
  Pill,
  Microscope,
  Syringe,
  Download,
  Eye,
  Plus,
  ArrowLeft,
  Building2,
  Search,
  Filter,
  Edit,
  Home,
  Calendar,
  MessageCircle,
  Settings,
} from "lucide-react";

// --- Reusable Layout Components ---
import { Header } from "./ui/header"; // Assuming path is correct
import { Footer } from "./ui/footer"; // Assuming path is correct

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
} from "@/components/ui/sidebar";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// --- TypeScript Interfaces ---
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  phone: string;
  email: string;
  address: string;
  insuranceStatus: string;
  chronicDiseases: string[];
}
interface EHRRecord {
  id: string;
  patientId: string;
  facilityId: string;
  facilityName: string;
  createdDate: string;
  lastUpdated: string;
  status: "active" | "archived" | "transferred";
  primaryDoctor: string;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  labResults: LabResult[];
  medicalNotes: MedicalNote[];
  vaccinations: Vaccination[];
}
interface Diagnosis {
  id: string;
  date: string;
  time: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpRequired: boolean;
  icd10Code?: string;
}
interface Prescription {
  id: string;
  date: string;
  time: string;
  doctor: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  status: "active" | "completed" | "discontinued";
}
interface LabResult {
  id: string;
  date: string;
  time: string;
  type: "laboratory" | "radiology" | "pathology";
  testName: string;
  result: string;
  normalRange?: string;
  notes: string;
  file?: string;
  doctor: string;
  facility: string;
  status: "normal" | "abnormal" | "critical";
}
interface MedicalNote {
  id: string;
  date: string;
  time: string;
  doctor: string;
  note: string;
  facility: string;
  category: "consultation" | "procedure" | "observation" | "discharge";
}
interface Vaccination {
  id: string;
  date: string;
  time: string;
  vaccineType: string;
  vaccineName: string;
  dose: string;
  location: string;
  administrator: string;
  batchNumber?: string;
  nextDueDate?: string;
}

// --- Reusable Sidebar ---
const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: FileText,
    isActive: true,
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

// --- Main Medical Records Page Component ---
export function MedicalRecordsSystem() {
  const [userRole, setUserRole] = useState<"doctor" | "patient" | "admin">(
    "doctor"
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedEHR, setSelectedEHR] = useState<EHRRecord | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewEHRDialog, setShowNewEHRDialog] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(true);

  // --- Sample Data --- (Assuming this data is fetched or passed as props in a real app)
  const patients: Patient[] = [
    {
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
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      dateOfBirth: "June 15, 1992",
      gender: "Female",
      bloodType: "A+",
      allergies: ["Latex"],
      phone: "+1-555-0124",
      email: "sarah.johnson@email.com",
      address: "456 Oak Avenue, Los Angeles, CA 90210",
      insuranceStatus: "Active",
      chronicDiseases: [],
    },
  ];
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
  ];

  // --- Handlers ---
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    const patientEHRs = ehrRecords.filter(
      (ehr) => ehr.patientId === patient.id
    );
    if (patientEHRs.length > 0) {
      setSelectedEHR(
        patientEHRs.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        )[0]
      );
    }
    setShowPatientSearch(false);
  };

  const handleEHRSelect = (ehr: EHRRecord) => {
    setSelectedEHR(ehr);
    setActiveTab("overview");
  };

  const handleCreateNewEHR = () => {
    toast({
      title: "New EHR Created",
      description:
        "A new Electronic Health Record has been created for this patient",
      duration: 3000,
    });
    setShowNewEHRDialog(false);
  };

  // --- Helper Functions ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "transferred":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "abnormal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "discontinued":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // --- Main Render Logic ---
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Reusable Header */}
          <Header pageTitle="Medical Records" />

          {/* Main Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {showPatientSearch ? (
              // --- Patient Search View ---
              <div className="space-y-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Medical Records System
                    </h1>
                    <p className="mt-2 text-gray-600">
                      Search and manage patient electronic health records
                    </p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Patient Search</CardTitle>
                    <CardDescription>
                      Search for a patient to view their medical records
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search by name, ID, or phone number..."
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {patients.map((patient) => (
                        <Card
                          key={patient.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {patient.name}
                                  </h3>
                                  <Badge variant="outline">{patient.id}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">DOB:</span>{" "}
                                    {patient.dateOfBirth}
                                  </div>
                                  <div>
                                    <span className="font-medium">Gender:</span>{" "}
                                    {patient.gender}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Blood Type:
                                    </span>{" "}
                                    {patient.bloodType}
                                  </div>
                                  <div>
                                    <span className="font-medium">Phone:</span>{" "}
                                    {patient.phone}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {patient.allergies.map((allergy, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-red-50 text-red-700 border-red-200"
                                    >
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={getStatusColor(
                                    patient.insuranceStatus.toLowerCase()
                                  )}
                                >
                                  {patient.insuranceStatus}
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">
                                  {
                                    ehrRecords.filter(
                                      (ehr) => ehr.patientId === patient.id
                                    ).length
                                  }{" "}
                                  EHR Records
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : selectedPatient && selectedEHR ? (
              // --- Patient Details View ---
              <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Button
                      variant="ghost"
                      className="mb-2 -ml-4 flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      onClick={() => setShowPatientSearch(true)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Patient Search</span>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Electronic Health Records
                    </h1>
                    <p className="mt-2 text-gray-600">
                      Patient: {selectedPatient.name} ({selectedPatient.id})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewEHRDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New EHR
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </div>

                {/* Patient Info Card */}
                <Card className="border-l-4 border-l-[#3FB6F6]">
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="font-medium">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date of Birth
                        </p>
                        <p>{selectedPatient.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Gender
                        </p>
                        <p>{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Blood Type
                        </p>
                        <p>{selectedPatient.bloodType}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Allergies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* EHR Records Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Electronic Health Records</CardTitle>
                    <CardDescription>
                      Select an EHR record to view details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {ehrRecords
                        .filter((ehr) => ehr.patientId === selectedPatient.id)
                        .map((ehr) => (
                          <Card
                            key={ehr.id}
                            className={`cursor-pointer transition-all ${
                              selectedEHR?.id === ehr.id
                                ? "ring-2 ring-[#3FB6F6] bg-blue-50"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => handleEHRSelect(ehr)}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">
                                      {ehr.facilityName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {ehr.primaryDoctor}
                                    </p>
                                  </div>
                                  <Badge className={getStatusColor(ehr.status)}>
                                    {ehr.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p>Created: {ehr.createdDate}</p>
                                  <p>Last Updated: {ehr.lastUpdated}</p>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{ehr.diagnoses.length} Diagnoses</span>
                                  <span>
                                    {ehr.prescriptions.length} Prescriptions
                                  </span>
                                  <span>
                                    {ehr.labResults.length} Lab Results
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected EHR Details */}
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
                          <Badge
                            className={`ml-2 ${getStatusColor(
                              selectedEHR.status
                            )}`}
                          >
                            {selectedEHR.status}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                        <TabsTrigger value="prescriptions">
                          Prescriptions
                        </TabsTrigger>
                        <TabsTrigger value="lab-results">
                          Lab Results
                        </TabsTrigger>
                        <TabsTrigger value="notes">Medical Notes</TabsTrigger>
                        <TabsTrigger value="vaccinations">
                          Vaccinations
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Total Diagnoses
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {selectedEHR.diagnoses.length}
                                  </p>
                                </div>
                                <FileText className="h-8 w-8 text-[#3FB6F6]" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Active Prescriptions
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {
                                      selectedEHR.prescriptions.filter(
                                        (p) => p.status === "active"
                                      ).length
                                    }
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
                                  <p className="text-sm font-medium text-gray-500">
                                    Lab Results
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {selectedEHR.labResults.length}
                                  </p>
                                </div>
                                <Microscope className="h-8 w-8 text-[#F59E0B]" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Vaccinations
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {selectedEHR.vaccinations.length}
                                  </p>
                                </div>
                                <Syringe className="h-8 w-8 text-[#8B5CF6]" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Recent Diagnoses
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {selectedEHR.diagnoses
                                  .slice(0, 3)
                                  .map((diagnosis) => (
                                    <div
                                      key={diagnosis.id}
                                      className="border-l-2 border-[#3FB6F6] pl-3"
                                    >
                                      <p className="font-medium">
                                        {diagnosis.diagnosis}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {diagnosis.doctor}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {diagnosis.date}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Active Medications
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {selectedEHR.prescriptions
                                  .filter((p) => p.status === "active")
                                  .slice(0, 3)
                                  .map((prescription) => (
                                    <div
                                      key={prescription.id}
                                      className="border-l-2 border-[#34D399] pl-3"
                                    >
                                      <p className="font-medium">
                                        {prescription.medication}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {prescription.dosage}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {prescription.duration}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      <TabsContent value="diagnoses" className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            Diagnosis History
                          </h3>
                          {userRole === "doctor" && (
                            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Diagnosis
                            </Button>
                          )}
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Doctor</TableHead>
                              <TableHead>Diagnosis</TableHead>
                              <TableHead>ICD-10</TableHead>
                              <TableHead>Follow-up</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEHR.diagnoses.map((diagnosis) => (
                              <TableRow key={diagnosis.id}>
                                <TableCell>
                                  <div>
                                    <p>{diagnosis.date}</p>
                                    <p className="text-xs text-gray-500">
                                      {diagnosis.time}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{diagnosis.doctor}</TableCell>
                                <TableCell>{diagnosis.diagnosis}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {diagnosis.icd10Code}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {diagnosis.followUpRequired ? (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Required
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-800">
                                      Not Required
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent
                        value="prescriptions"
                        className="space-y-4 pt-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            Prescription History
                          </h3>
                          {userRole === "doctor" && (
                            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Prescription
                            </Button>
                          )}
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEHR.prescriptions.map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell>
                                  <div>
                                    <p>{prescription.date}</p>
                                    <p className="text-xs text-gray-500">
                                      {prescription.time}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{prescription.medication}</TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>{prescription.duration}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={getStatusColor(
                                      prescription.status
                                    )}
                                  >
                                    {prescription.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent
                        value="lab-results"
                        className="space-y-4 pt-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            Laboratory Results
                          </h3>
                          {userRole === "doctor" && (
                            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lab Result
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {selectedEHR.labResults.map((result) => (
                            <Card key={result.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-blue-100 text-blue-800">
                                        {result.type}
                                      </Badge>
                                      <Badge
                                        className={getStatusColor(
                                          result.status
                                        )}
                                      >
                                        {result.status}
                                      </Badge>
                                    </div>
                                    <h4 className="font-semibold">
                                      {result.testName}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-500">Result:</p>
                                        <p className="font-medium">
                                          {result.result}
                                        </p>
                                      </div>
                                      {result.normalRange && (
                                        <div>
                                          <p className="text-gray-500">
                                            Normal Range:
                                          </p>
                                          <p>{result.normalRange}</p>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {result.notes}
                                    </p>
                                    <div className="text-xs text-gray-500">
                                      <p>
                                        {result.doctor} | {result.facility}
                                      </p>
                                      <p>
                                        {result.date} at {result.time}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="notes" className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Medical Notes</h3>
                          {userRole === "doctor" && (
                            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Note
                            </Button>
                          )}
                        </div>
                        <div className="space-y-4">
                          {selectedEHR.medicalNotes.map((note) => (
                            <Card key={note.id}>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <Badge variant="outline">
                                        {note.category}
                                      </Badge>
                                      <p className="font-medium mt-1">
                                        {note.doctor}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {note.date} at {note.time}
                                    </p>
                                  </div>
                                  <p className="text-gray-700">{note.note}</p>
                                  <p className="text-xs text-gray-500">
                                    {note.facility}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent
                        value="vaccinations"
                        className="space-y-4 pt-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            Vaccination History
                          </h3>
                          {userRole === "doctor" && (
                            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Vaccination
                            </Button>
                          )}
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Vaccine Type</TableHead>
                              <TableHead>Vaccine Name</TableHead>
                              <TableHead>Dose</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Next Due</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEHR.vaccinations.map((vaccination) => (
                              <TableRow key={vaccination.id}>
                                <TableCell>
                                  <div>
                                    <p>{vaccination.date}</p>
                                    <p className="text-xs text-gray-500">
                                      {vaccination.time}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{vaccination.vaccineType}</TableCell>
                                <TableCell>{vaccination.vaccineName}</TableCell>
                                <TableCell>{vaccination.dose}</TableCell>
                                <TableCell>{vaccination.location}</TableCell>
                                <TableCell>
                                  {vaccination.nextDueDate ? (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      {vaccination.nextDueDate}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-500">N/A</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Create New EHR Dialog */}
                <Dialog
                  open={showNewEHRDialog}
                  onOpenChange={setShowNewEHRDialog}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New EHR Record</DialogTitle>
                      <DialogDescription>
                        Create a new Electronic Health Record for{" "}
                        {selectedPatient.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="facility">Healthcare Facility</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="f1">
                              HealthSync General Hospital
                            </SelectItem>
                            <SelectItem value="f2">
                              City Medical Center
                            </SelectItem>
                            <SelectItem value="f3">
                              Community Health Clinic
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor">Primary Doctor</Label>
                        <Input placeholder="Enter primary doctor name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for New EHR</Label>
                        <Textarea placeholder="Enter reason for creating new EHR record" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewEHRDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]"
                        onClick={handleCreateNewEHR}
                      >
                        Create EHR
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              // --- Loading or Empty State ---
              <div>Loading patient data or no EHR found...</div>
            )}
          </main>

          {/* Reusable Footer */}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
