"use client"

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
import { id } from "date-fns/locale"
import { CalendarIcon, AlertCircle, Clock, XCircle } from "lucide-react"

export function AntrianOnline() {
  const [date, setDate] = useState<Date>()
  const [hasActiveQueue, setHasActiveQueue] = useState(true)
  const [showNotification, setShowNotification] = useState(true)

  const facilities = [
    { value: "puskesmas-a", label: "Puskesmas Sejahtera" },
    { value: "rs-b", label: "Rumah Sakit Sehat" },
    { value: "klinik-c", label: "Klinik Bahagia" },
  ]

  const services = [
    { value: "poli-umum", label: "Poli Umum" },
    { value: "poli-gigi", label: "Poli Gigi" },
    { value: "lab", label: "Laboratorium" },
    { value: "radiologi", label: "Radiologi" },
  ]

  const doctors = [
    { value: "dr-andi", label: "dr. Andi Pratama, Sp.PD" },
    { value: "dr-budi", label: "dr. Budi Santoso, Sp.OG" },
    { value: "dr-citra", label: "dr. Citra Dewi, Sp.A" },
    { value: "dr-dian", label: "dr. Dian Purnama, Sp.JP" },
  ]

  const timeSlots = [
    { value: "08-00", label: "08:00" },
    { value: "09-00", label: "09:00" },
    { value: "10-00", label: "10:00" },
    { value: "11-00", label: "11:00" },
    { value: "13-00", label: "13:00" },
    { value: "14-00", label: "14:00" },
    { value: "15-00", label: "15:00" },
  ]

  const appointmentHistory = [
    {
      id: 1,
      date: "12 April 2023",
      facility: "Puskesmas Sejahtera",
      doctor: "dr. Andi Pratama, Sp.PD",
      service: "Poli Umum",
      status: "Selesai",
    },
    {
      id: 2,
      date: "25 Mei 2023",
      facility: "Rumah Sakit Sehat",
      doctor: "dr. Budi Santoso, Sp.OG",
      service: "Poli Gigi",
      status: "Dibatalkan",
    },
    {
      id: 3,
      date: "10 Juni 2023",
      facility: "Klinik Bahagia",
      doctor: "dr. Citra Dewi, Sp.A",
      service: "Laboratorium",
      status: "Tidak Hadir",
    },
    {
      id: 4,
      date: "5 Juli 2023",
      facility: "Puskesmas Sejahtera",
      doctor: "dr. Dian Purnama, Sp.JP",
      service: "Radiologi",
      status: "Selesai",
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setHasActiveQueue(true)
    // Logic to submit appointment
  }

  const handleCancelAppointment = () => {
    setHasActiveQueue(false)
    // Logic to cancel appointment
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return <Badge className="bg-green-500">Selesai</Badge>
      case "Dibatalkan":
        return <Badge className="bg-red-500">Dibatalkan</Badge>
      case "Tidak Hadir":
        return <Badge className="bg-yellow-500">Tidak Hadir</Badge>
      default:
        return <Badge>Menunggu</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Antrian Online & Jadwal Janji Temu</h1>
        <p className="mt-2 text-gray-600">Pilih fasilitas dan jadwal layanan Anda</p>
      </div>

      {showNotification && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Perhatian</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Dokter Andi Pratama tidak tersedia pada tanggal 20 April 2023. Silakan pilih dokter atau tanggal lain.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-yellow-800 hover:text-yellow-900 hover:bg-yellow-100"
            onClick={() => setShowNotification(false)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <Tabs defaultValue="appointment" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointment">Buat Janji Temu</TabsTrigger>
          <TabsTrigger value="history">Riwayat Janji Temu</TabsTrigger>
        </TabsList>

        <TabsContent value="appointment" className="space-y-6">
          {hasActiveQueue && (
            <Card className="border-l-4 border-l-[#3FB6F6]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Status Antrian Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#3FB6F6]">Nomor Antrian Anda: A-17</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Perkiraan Waktu: 10:30 WIB</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">Sedang Menunggu</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 md:mt-0"
                    onClick={handleCancelAppointment}
                  >
                    Batalkan Janji Temu
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Form Janji Temu</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facility">Pilih Fasilitas Kesehatan</Label>
                    <Select required>
                      <SelectTrigger id="facility">
                        <SelectValue placeholder="Pilih fasilitas kesehatan" />
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
                    <Label htmlFor="service">Pilih Layanan</Label>
                    <Select required>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Pilih layanan" />
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
                    <Label htmlFor="date">Tanggal</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={id} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Jam</Label>
                    <Select required>
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Pilih jam" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Pilih Dokter</Label>
                    <Select required>
                      <SelectTrigger id="doctor">
                        <SelectValue placeholder="Pilih dokter" />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complaint">Keluhan Utama</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Deskripsikan keluhan Anda secara singkat"
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                >
                  Konfirmasi Janji Temu
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Janji Temu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Fasilitas</TableHead>
                      <TableHead>Dokter</TableHead>
                      <TableHead>Layanan</TableHead>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
