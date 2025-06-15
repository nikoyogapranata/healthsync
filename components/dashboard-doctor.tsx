"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  Users,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Bell,
  User,
  LogOut,
  Settings,
  UserCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardDoctor() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showAddDiagnosisDialog, setShowAddDiagnosisDialog] = useState(false)

  // Sample doctor data
  const doctorData = {
    name: "Dr. Michael Brown, MD",
    specialty: "Internal Medicine",
    todayPatients: 12,
    pendingReports: 5,
    totalPatients: 847,
  }

  // Sample today's appointments
  const todayAppointments = [
    {
      id: 1,
      time: "08:00 AM",
      patient: "John Smith",
      patientId: "P001",
      type: "Follow-up",
      status: "Completed",
      complaint: "Diabetes check-up",
    },
    {
      id: 2,
      time: "09:30 AM",
      patient: "Sarah Johnson",
      patientId: "P002",
      type: "New Patient",
      status: "In Progress",
      complaint: "Chest pain",
    },
    {
      id: 3,
      time: "10:15 AM",
      patient: "Robert Davis",
      patientId: "P003",
      type: "Consultation",
      status: "Waiting",
      complaint: "Hypertension management",
    },
    {
      id: 4,
      time: "11:00 AM",
      patient: "Emily Wilson",
      patientId: "P004",
      type: "Follow-up",
      status: "Scheduled",
      complaint: "Lab results review",
    },
  ]

  // Sample patient list
  const patientList = [
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      lastVisit: "2023-12-15",
      diagnosis: "Type 2 Diabetes",
      status: "Active",
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2023-12-14",
      diagnosis: "Hypertension",
      status: "Active",
    },
    {
      id: "P003",
      name: "Robert Davis",
      age: 58,
      gender: "Male",
      lastVisit: "2023-12-13",
      diagnosis: "Coronary Artery Disease",
      status: "Follow-up Required",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Scheduled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Follow-up Required":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAddDiagnosis = () => {
    toast({
      title: "Diagnosis Added",
      description: "Patient diagnosis has been successfully recorded",
      duration: 3000,
    })
    setShowAddDiagnosisDialog(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {doctorData.name}!</h1>
          <p className="mt-2 text-gray-600">{doctorData.specialty} | HealthSync General Hospital</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Lab Results Ready</span>
                <span className="text-xs text-muted-foreground">John Smith - Blood work completed</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Urgent Consultation</span>
                <span className="text-xs text-muted-foreground">Sarah Johnson - Chest pain follow-up</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-[#3FB6F6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Patients</p>
                <p className="text-2xl font-bold text-[#3FB6F6]">{doctorData.todayPatients}</p>
              </div>
              <Users className="h-8 w-8 text-[#3FB6F6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#34D399]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                <p className="text-2xl font-bold text-[#34D399]">{doctorData.pendingReports}</p>
              </div>
              <FileText className="h-8 w-8 text-[#34D399]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{doctorData.totalPatients}</p>
              </div>
              <UserCheck className="h-8 w-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8B5CF6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Consultation</p>
                <p className="text-2xl font-bold text-[#8B5CF6]">25 min</p>
              </div>
              <Clock className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Reminder</AlertTitle>
        <AlertDescription className="text-blue-700">
          You have 3 patients scheduled for follow-up appointments this week. Please review their medical records.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
          <TabsTrigger value="reports">Medical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule - December 15, 2023
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.time}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">{appointment.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>{appointment.complaint}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Patient Management
                  </CardTitle>
                  <CardDescription>Manage your patients and their medical records</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]"
                    onClick={() => setShowAddDiagnosisDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Diagnosis
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search patients..." className="pl-8" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age/Gender</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientList.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {patient.age} / {patient.gender}
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Reports & Documentation
              </CardTitle>
              <CardDescription>Manage medical reports and patient documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-l-4 border-l-[#3FB6F6]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Lab Reports</h3>
                      <p className="text-2xl font-bold text-[#3FB6F6]">8</p>
                      <p className="text-sm text-gray-600">Pending review</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-[#34D399]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Radiology Reports</h3>
                      <p className="text-2xl font-bold text-[#34D399]">3</p>
                      <p className="text-sm text-gray-600">Awaiting interpretation</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-[#F59E0B]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Discharge Summaries</h3>
                      <p className="text-2xl font-bold text-[#F59E0B]">2</p>
                      <p className="text-sm text-gray-600">To be completed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Diagnosis Dialog */}
      <Dialog open={showAddDiagnosisDialog} onOpenChange={setShowAddDiagnosisDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Diagnosis</DialogTitle>
            <DialogDescription>Record a new diagnosis for a patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">John Smith (P001)</SelectItem>
                    <SelectItem value="p2">Sarah Johnson (P002)</SelectItem>
                    <SelectItem value="p3">Robert Davis (P003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Primary Diagnosis</Label>
              <Input placeholder="Enter primary diagnosis" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icd10">ICD-10 Code</Label>
              <Input placeholder="Enter ICD-10 code" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea placeholder="Enter treatment plan and recommendations" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Clinical Notes</Label>
              <Textarea placeholder="Enter additional clinical notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDiagnosisDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]" onClick={handleAddDiagnosis}>
              Save Diagnosis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
