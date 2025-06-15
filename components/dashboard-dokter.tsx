"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  FilePlus,
  Filter,
  Plus,
  Search,
  Settings,
  User,
  X,
  AlertCircle,
  Download,
  Printer,
  Send,
  Edit,
  Eye,
  Package,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardDokter() {
  const [showNotification, setShowNotification] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false)

  // Data dokter
  const doctorData = {
    nama: "dr. Budi Santoso, Sp.PD",
    spesialisasi: "Spesialis Penyakit Dalam",
    poli: "Poli Penyakit Dalam",
    rumahSakit: "RS HealthSync",
  }

  // Data statistik
  const statsData = {
    pasienHariIni: 12,
    totalPasien: 45,
    janjiTemuBerikutnya: {
      waktu: "10:30",
      nama: "Ahmad Fauzi",
      poli: "Poli Penyakit Dalam",
    },
    layananAktif: "Poli Penyakit Dalam",
  }

  // Data antrian pasien
  const queueData = [
    {
      id: 1,
      no: "A-001",
      waktu: "08:00",
      nama: "Siti Nurhaliza",
      keluhan: "Demam, batuk, pilek selama 3 hari",
      status: "Selesai",
    },
    {
      id: 2,
      no: "A-002",
      waktu: "08:30",
      nama: "Budi Setiawan",
      keluhan: "Nyeri perut bagian atas",
      status: "Diperiksa",
    },
    {
      id: 3,
      no: "A-003",
      waktu: "09:00",
      nama: "Ahmad Fauzi",
      keluhan: "Kontrol diabetes",
      status: "Menunggu",
    },
    {
      id: 4,
      no: "A-004",
      waktu: "09:30",
      nama: "Dewi Kartika",
      keluhan: "Sakit kepala, mual",
      status: "Menunggu",
    },
    {
      id: 5,
      no: "A-005",
      waktu: "10:00",
      nama: "Rudi Hermawan",
      keluhan: "Kontrol hipertensi",
      status: "Menunggu",
    },
  ]

  // Data jadwal praktik
  const scheduleData = [
    { hari: "Senin", waktu: "08:00 - 14:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Selasa", waktu: "08:00 - 14:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Rabu", waktu: "12:00 - 18:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Kamis", waktu: "08:00 - 14:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Jumat", waktu: "13:00 - 17:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Sabtu", waktu: "08:00 - 12:00", poli: "Poli Penyakit Dalam", status: "Aktif" },
    { hari: "Minggu", waktu: "-", poli: "-", status: "Tidak Aktif" },
  ]

  // Data riwayat rekam medis
  const medicalHistoryData = [
    {
      id: 1,
      tanggal: "12 April 2023",
      nama: "Siti Nurhaliza",
      diagnosa: "Influenza",
      resep: "Paracetamol 500mg, Pseudoephedrine",
    },
    {
      id: 2,
      tanggal: "11 April 2023",
      nama: "Budi Setiawan",
      diagnosa: "Gastritis",
      resep: "Antasida, Omeprazole 20mg",
    },
    {
      id: 3,
      tanggal: "10 April 2023",
      nama: "Ahmad Fauzi",
      diagnosa: "Diabetes Mellitus Tipe 2",
      resep: "Metformin 500mg, Glimepiride 2mg",
    },
    {
      id: 4,
      tanggal: "10 April 2023",
      nama: "Dewi Kartika",
      diagnosa: "Tension Headache",
      resep: "Paracetamol 500mg, Ibuprofen 400mg",
    },
    {
      id: 5,
      tanggal: "9 April 2023",
      nama: "Rudi Hermawan",
      diagnosa: "Hipertensi Grade 1",
      resep: "Amlodipine 5mg, Captopril 25mg",
    },
  ]

  // Data obat untuk autocomplete
  const medicineData = [
    { value: "paracetamol", label: "Paracetamol 500mg" },
    { value: "amoxicillin", label: "Amoxicillin 500mg" },
    { value: "omeprazole", label: "Omeprazole 20mg" },
    { value: "metformin", label: "Metformin 500mg" },
    { value: "amlodipine", label: "Amlodipine 5mg" },
    { value: "simvastatin", label: "Simvastatin 20mg" },
    { value: "ibuprofen", label: "Ibuprofen 400mg" },
    { value: "cetirizine", label: "Cetirizine 10mg" },
  ]

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200"
      case "Diperiksa":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Menunggu":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fungsi untuk mendapatkan warna status jadwal
  const getScheduleStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800 border-green-200"
      case "Tidak Aktif":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fungsi untuk menangani klik tombol periksa
  const handleExamineClick = (patient) => {
    setSelectedPatient(patient)
    setShowMedicalRecordForm(true)
  }

  // Fungsi untuk menangani submit form rekam medis
  const handleMedicalRecordSubmit = (e) => {
    e.preventDefault()
    // Logika untuk menyimpan rekam medis
    setShowMedicalRecordForm(false)
    setSelectedPatient(null)
  }

  // Mendapatkan hari ini
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long" })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Dokter</h1>
          <p className="mt-2 text-gray-600">Kelola pasien, jadwal, dan rekam medis dengan mudah</p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Pasien Baru Terdaftar</span>
                <span className="text-xs text-muted-foreground">Hari ini, 08:15 WIB</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Perubahan Jadwal Praktik</span>
                <span className="text-xs text-muted-foreground">Kemarin, 14:30 WIB</span>
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
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifikasi */}
      {showNotification && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Informasi Jadwal</AlertTitle>
          <AlertDescription className="text-blue-700">
            Jadwal praktik Anda untuk hari Rabu, 19 April 2023 telah diubah menjadi pukul 12:00 - 18:00 WIB.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-blue-800 hover:text-blue-900 hover:bg-blue-100"
            onClick={() => setShowNotification(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Ringkasan Hari Ini */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Jumlah Pasien Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.pasienHariIni}</div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Total: {statsData.totalPasien}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Janji Temu Berikutnya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">{statsData.janjiTemuBerikutnya.waktu} WIB</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{statsData.janjiTemuBerikutnya.nama}</p>
                <p className="text-gray-500">{statsData.janjiTemuBerikutnya.poli}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Layanan Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="font-medium">{statsData.layananAktif}</div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigasi Utama */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <FileText className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Rekam Medis Pasien</CardTitle>
          </CardContent>
        </Card>

        <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <ClipboardList className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Daftar Antrian</CardTitle>
          </CardContent>
        </Card>

        <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Calendar className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Jadwal Praktik</CardTitle>
          </CardContent>
        </Card>

        <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Package className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Riwayat Resep</CardTitle>
          </CardContent>
        </Card>

        <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Settings className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Profil & Pengaturan</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Tabs untuk konten utama */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="queue">Antrian Pasien</TabsTrigger>
          <TabsTrigger value="medical-record">Rekam Medis</TabsTrigger>
          <TabsTrigger value="schedule">Jadwal Praktik</TabsTrigger>
          <TabsTrigger value="history">Riwayat Rekam Medis</TabsTrigger>
        </TabsList>

        {/* Tab Antrian Pasien */}
        <TabsContent value="queue" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Daftar Antrian Pasien Hari Ini</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                <Plus className="mr-2 h-4 w-4" />
                <span>Tambah Pasien</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead className="hidden md:table-cell">Keluhan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queueData.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.no}</TableCell>
                      <TableCell>{patient.waktu}</TableCell>
                      <TableCell className="font-medium">{patient.nama}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.keluhan}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {patient.status === "Menunggu" && (
                          <Button
                            onClick={() => handleExamineClick(patient)}
                            className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                            size="sm"
                          >
                            Periksa
                          </Button>
                        )}
                        {patient.status === "Diperiksa" && (
                          <Button onClick={() => handleExamineClick(patient)} variant="outline" size="sm">
                            Lanjutkan
                          </Button>
                        )}
                        {patient.status === "Selesai" && (
                          <Button onClick={() => handleExamineClick(patient)} variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Rekam Medis */}
        <TabsContent value="medical-record" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Form Rekam Medis Pasien</h3>
            <Button variant="outline" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span>Rekam Medis Baru</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pengisian Rekam Medis</CardTitle>
              <CardDescription>Silakan isi data rekam medis pasien dengan lengkap dan akurat</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Nama Pasien</Label>
                    <Input id="patientName" placeholder="Masukkan nama pasien" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="Masukkan diagnosis" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Dokter</Label>
                  <Textarea id="notes" placeholder="Masukkan catatan medis" rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Tindakan</Label>
                  <Textarea id="treatment" placeholder="Masukkan tindakan yang dilakukan" rows={2} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicine">Resep Obat</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih obat" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicineData.map((medicine) => (
                        <SelectItem key={medicine.value} value={medicine.value}>
                          {medicine.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Paracetamol 500mg <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Amoxicillin 500mg <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                    <Button variant="outline" size="sm" className="h-6">
                      <Plus className="h-3 w-3 mr-1" /> Tambah Obat
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Batal</Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span>Cetak PDF</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>Kirim ke Farmasi</span>
                  </Button>
                  <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Jadwal Praktik */}
        <TabsContent value="schedule" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Jadwal Praktik Dokter</h3>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit Jadwal</span>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hari</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Poli</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.map((schedule, index) => (
                    <TableRow key={index} className={today === schedule.hari ? "bg-blue-50" : ""}>
                      <TableCell className="font-medium">
                        {schedule.hari}
                        {today === schedule.hari && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">Hari Ini</Badge>
                        )}
                      </TableCell>
                      <TableCell>{schedule.waktu}</TableCell>
                      <TableCell>{schedule.poli}</TableCell>
                      <TableCell>
                        <Badge className={getScheduleStatusColor(schedule.status)}>{schedule.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Riwayat Rekam Medis */}
        <TabsContent value="history" className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-medium">Riwayat Rekam Medis</h3>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Cari pasien..." className="pl-8" />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                    <TableHead className="hidden md:table-cell">Resep</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalHistoryData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.tanggal}</TableCell>
                      <TableCell className="font-medium">{record.nama}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.diagnosa}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.resep}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Lihat Detail</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detail Rekam Medis</DialogTitle>
                              <DialogDescription>Informasi lengkap rekam medis pasien</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Tanggal</h4>
                                  <p>{record.tanggal}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Nama Pasien</h4>
                                  <p>{record.nama}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                                <p>{record.diagnosa}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Resep</h4>
                                <p>{record.resep}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Catatan Dokter</h4>
                                <p>
                                  Pasien menunjukkan gejala {record.diagnosa.toLowerCase()} dengan keluhan utama yang
                                  sudah berlangsung selama 3 hari. Disarankan untuk istirahat yang cukup dan minum obat
                                  secara teratur.
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="flex items-center gap-2">
                                <Printer className="h-4 w-4" />
                                <span>Cetak</span>
                              </Button>
                              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                                Tutup
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Form Rekam Medis */}
      {selectedPatient && (
        <Dialog open={showMedicalRecordForm} onOpenChange={setShowMedicalRecordForm}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Form Rekam Medis Pasien</DialogTitle>
              <DialogDescription>
                Pasien: {selectedPatient.nama} - {selectedPatient.no} ({selectedPatient.waktu} WIB)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMedicalRecordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nama Pasien</Label>
                  <Input id="patientName" value={selectedPatient.nama} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint">Keluhan</Label>
                <Textarea id="complaint" defaultValue={selectedPatient.keluhan} rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" placeholder="Masukkan diagnosis" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Dokter</Label>
                <Textarea id="notes" placeholder="Masukkan catatan medis" rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Tindakan</Label>
                <Textarea id="treatment" placeholder="Masukkan tindakan yang dilakukan" rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicine">Resep Obat</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih obat" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicineData.map((medicine) => (
                      <SelectItem key={medicine.value} value={medicine.value}>
                        {medicine.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Paracetamol 500mg <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Button variant="outline" size="sm" className="h-6">
                    <Plus className="h-3 w-3 mr-1" /> Tambah Obat
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMedicalRecordForm(false)}>
                  Batal
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  <span>Cetak PDF</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Kirim ke Farmasi</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                >
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <footer className="border-t pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">&copy; 2023 HealthSync. Hak Cipta Dilindungi.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/bantuan" className="text-sm text-gray-500 hover:text-[#3FB6F6]">
              Bantuan
            </Link>
            <Link href="/kebijakan-privasi" className="text-sm text-gray-500 hover:text-[#3FB6F6]">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-sm text-gray-500 hover:text-[#3FB6F6]">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
