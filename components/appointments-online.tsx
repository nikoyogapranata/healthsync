"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { CalendarIcon, AlertCircle, Clock, XCircle } from "lucide-react"

export function AppointmentsOnline() {
  const [date, setDate] = useState<Date>()
  const [hasActiveQueue, setHasActiveQueue] = useState(true)
  const [showNotification, setShowNotification] = useState(true)

  const facilities = [
    { value: "hospital-a", label: "HealthSync General Hospital" },
    { value: "hospital-b", label: "City Medical Center" },
    { value: "clinic-c", label: "Community Health Clinic" },
  ]

  const services = [
    { value: "general", label: "General Practice" },
    { value: "dental", label: "Dental Care" },
    { value: "lab", label: "Laboratory" },
    { value: "radiology", label: "Radiology" },
  ]

  const doctors = [
    { value: "dr-smith", label: "Dr. John Smith, MD" },
    { value: "dr-johnson", label: "Dr. Sarah Johnson, MD" },
    { value: "dr-brown", label: "Dr. Michael Brown, MD" },
    { value: "dr-wilson", label: "Dr. Emily Wilson, MD" },
  ]

  const timeSlots = [
    { value: "08-00", label: "08:00 AM" },
    { value: "09-00", label: "09:00 AM" },
    { value: "10-00", label: "10:00 AM" },
    { value: "11-00", label: "11:00 AM" },
    { value: "01-00", label: "01:00 PM" },
    { value: "02-00", label: "02:00 PM" },
    { value: "03-00", label: "03:00 PM" },
  ]

  const appointmentHistory = [
    {
      id: 1,
      date: "April 12, 2023",
      facility: "HealthSync General Hospital",
      doctor: "Dr. John Smith, MD",
      service: "General Practice",
      status: "Completed",
    },
    {
      id: 2,
      date: "May 25, 2023",
      facility: "City Medical Center",
      doctor: "Dr. Sarah Johnson, MD",
      service: "Dental Care",
      status: "Cancelled",
    },
    {
      id: 3,
      date: "June 10, 2023",
      facility: "Community Health Clinic",
      doctor: "Dr. Michael Brown, MD",
      service: "Laboratory",
      status: "No Show",
    },
    {
      id: 4,
      date: "July 5, 2023",
      facility: "HealthSync General Hospital",
      doctor: "Dr. Emily Wilson, MD",
      service: "Radiology",
      status: "Completed",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHasActiveQueue(true)
    // Logic to submit appointment
  }

  const handleCancelAppointment = () => {
    setHasActiveQueue(false)
    // Logic to cancel appointment
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "No Show":
        return <Badge className="bg-yellow-500">No Show</Badge>
      default:
        return <Badge>Waiting</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Online Appointments & Queue System</h1>
        <p className="mt-2 text-gray-600">Select your healthcare facility and schedule your appointment</p>
      </div>

      {showNotification && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Notice</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Dr. John Smith is not available on April 20, 2023. Please select another doctor or date.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-yellow-800 hover:text-yellow-900 hover:bg-yellow-100"
            onClick={() => setShowNotification(false)}
          >
            &times;
          </Button>
        </Alert>
      )}

      <Tabs defaultValue="book-appointment" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book-appointment">Book Appointment</TabsTrigger>
          <TabsTrigger value="appointment-history">Appointment History</TabsTrigger>
        </TabsList>

        <TabsContent value="book-appointment" className="space-y-6">
          {hasActiveQueue && (
            <Card className="border-l-4 border-l-[#3FB6F6]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#3FB6F6]" />
                  Current Queue Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Queue Number</p>
                    <p className="text-2xl font-bold text-[#3FB6F6]">A-17</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Wait Time</p>
                    <p className="text-lg font-semibold">25 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Queue</p>
                    <p className="text-lg font-semibold">A-12</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    View Queue Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelAppointment}>
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
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facility">Healthcare Facility</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.value} value={facility.value}>
                            {facility.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Preferred Doctor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.value} value={doctor.value}>
                            {doctor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Appointment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-7">
                      {timeSlots.map((slot) => (
                        <Button key={slot.value} type="button" variant="outline" className="text-sm">
                          {slot.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="complaint">Chief Complaint</Label>
                    <Textarea
                      id="complaint"
                      placeholder="Describe your symptoms or reason for visit..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                    Book Appointment
                  </Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointment-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentHistory.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.facility}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
