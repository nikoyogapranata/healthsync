"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bell,
  Calendar,
  FileText,
  Plus,
  Search,
  Settings,
  User,
  X,
  AlertCircle,
  Download,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  LayoutDashboard,
  FileCheck,
  Stethoscope,
  HospitalIcon as HospitalSquare,
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

export function DashboardAdmin() {
  const [showNotification, setShowNotification] = useState(true)
  const [activeTab, setActiveTab] = useState("users")
  const [showUserForm, setShowUserForm] = useState(false)
  const [showFacilityForm, setShowFacilityForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Data statistik
  const statsData = {
    totalDoctors: 48,
    totalPatients: 1250,
    totalVisitsToday: 124,
    pendingRegistrations: 15,
  }

  // Data pengguna
  const userData = [
    {
      id: 1,
      nama: "dr. Budi Santoso",
      email: "budi.santoso@dokter.com",
      role: "Dokter",
      status: "Aktif",
      nomorInduk: "DOK-2023-001",
      fasilitas: "RS HealthSync",
    },
    {
      id: 2,
      nama: "Ahmad Fauzi",
      email: "ahmad.fauzi@pasien.com",
      role: "Pasien",
      status: "Aktif",
      nomorInduk: "PAS-2023-120",
      fasilitas: "-",
    },
    {
      id: 3,
      nama: "dr. Siti Nurhaliza",
      email: "siti.nurhaliza@dokter.com",
      role: "Dokter",
      status: "Nonaktif",
      nomorInduk: "DOK-2023-015",
      fasilitas: "Puskesmas Sejahtera",
    },
    {
      id: 4,
      nama: "Rudi Hermawan",
      email: "rudi.hermawan@pasien.com",
      role: "Pasien",
      status: "Diblokir",
      nomorInduk: "PAS-2023-089",
      fasilitas: "-",
    },
    {
      id: 5,
      nama: "dr. Dewi Kartika",
      email: "dewi.kartika@dokter.com",
      role: "Dokter",
      status: "Aktif",
      nomorInduk: "DOK-2023-022",
      fasilitas: "RS HealthSync",
    },
  ]

  // Data jadwal dokter
  const doctorScheduleData = [
    {
      id: 1,
      nama: "dr. Budi Santoso",
      poli: "Poli Penyakit Dalam",
      senin: "08:00 - 14:00",
      selasa: "08:00 - 14:00",
      rabu: "12:00 - 18:00",
      kamis: "08:00 - 14:00",
      jumat: "13:00 - 17:00",
      sabtu: "08:00 - 12:00",
      minggu: "-",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "dr. Siti Nurhaliza",
      poli: "Poli Anak",
      senin: "08:00 - 12:00",
      selasa: "-",
      rabu: "08:00 - 12:00",
      kamis: "08:00 - 12:00",
      jumat: "08:00 - 11:00",
      sabtu: "-",
      minggu: "-",
      status: "Nonaktif",
    },
    {
      id: 3,
      nama: "dr. Dewi Kartika",
      poli: "Poli Mata",
      senin: "13:00 - 17:00",
      selasa: "13:00 - 17:00",
      rabu: "-",
      kamis: "13:00 - 17:00",
      jumat: "-",
      sabtu: "08:00 - 12:00",
      minggu: "-",
      status: "Aktif",
    },
  ]

  // Data pendaftaran yang perlu verifikasi
  const registrationData = [
    {
      id: 1,
      nama: "Dian Sastro",
      email: "dian.sastro@pasien.com",
      tanggal: "15 April 2023",
      role: "Pasien",
      status: "Menunggu",
    },
    {
      id: 2,
      nama: "dr. Anita Wijaya",
      email: "anita.wijaya@dokter.com",
      tanggal: "14 April 2023",
      role: "Dokter",
      status: "Menunggu",
    },
    {
      id: 3,
      nama: "Bambang Suparman",
      email: "bambang.suparman@pasien.com",
      tanggal: "14 April 2023",
      role: "Pasien",
      status: "Menunggu",
    },
    {
      id: 4,
      nama: "dr. Rini Marlina",
      email: "rini.marlina@dokter.com",
      tanggal: "13 April 2023",
      role: "Dokter",
      status: "Menunggu",
    },
    {
      id: 5,
      nama: "Joko Widodo",
      email: "joko.widodo@pasien.com",
      tanggal: "13 April 2023",
      role: "Pasien",
      status: "Menunggu",
    },
  ]

  // Data fasilitas kesehatan
  const facilityData = [
    {
      id: 1,
      nama: "RS HealthSync",
      alamat: "Jl. Kesehatan No. 123, Jakarta Selatan",
      jenis: "Rumah Sakit",
      layanan: "Umum, Spesialis, IGD 24 Jam",
      nomorIzin: "RS-JKT-2023-001",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Puskesmas Sejahtera",
      alamat: "Jl. Raya Bogor Km. 30, Depok",
      jenis: "Puskesmas",
      layanan: "Umum, KIA, Gigi",
      nomorIzin: "PKM-DPK-2023-015",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Klinik Bahagia",
      alamat: "Jl. Margonda Raya No. 45, Depok",
      jenis: "Klinik",
      layanan: "Umum, Gigi",
      nomorIzin: "KLN-DPK-2023-022",
      status: "Aktif",
    },
    {
      id: 4,
      nama: "RS Sehat Sentosa",
      alamat: "Jl. Pahlawan No. 78, Jakarta Timur",
      jenis: "Rumah Sakit",
      layanan: "Umum, Spesialis, IGD 24 Jam",
      nomorIzin: "RS-JKT-2023-008",
      status: "Aktif",
    },
  ]

  // Data kunjungan
  const visitData = [
    {
      id: 1,
      tanggal: "15 April 2023",
      pasien: "Ahmad Fauzi",
      dokter: "dr. Budi Santoso",
      poli: "Poli Penyakit Dalam",
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "15 April 2023",
      pasien: "Siti Nurhaliza",
      dokter: "dr. Dewi Kartika",
      poli: "Poli Mata",
      status: "Selesai",
    },
    {
      id: 3,
      tanggal: "15 April 2023",
      pasien: "Rudi Hermawan",
      dokter: "dr. Budi Santoso",
      poli: "Poli Penyakit Dalam",
      status: "Batal",
    },
    {
      id: 4,
      tanggal: "14 April 2023",
      pasien: "Dewi Kartika",
      dokter: "dr. Siti Nurhaliza",
      poli: "Poli Anak",
      status: "Selesai",
    },
    {
      id: 5,
      tanggal: "14 April 2023",
      pasien: "Bambang Suparman",
      dokter: "dr. Dewi Kartika",
      poli: "Poli Mata",
      status: "Selesai",
    },
  ]

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800 border-green-200"
      case "Nonaktif":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Diblokir":
        return "bg-red-100 text-red-800 border-red-200"
      case "Menunggu":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200"
      case "Batal":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fungsi untuk menangani klik tombol edit pengguna
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowUserForm(true)
  }

  // Fungsi untuk menangani submit form pengguna
  const handleUserFormSubmit = (e) => {
    e.preventDefault()
    // Logika untuk menyimpan data pengguna
    setShowUserForm(false)
    setSelectedUser(null)
  }

  // Fungsi untuk menangani submit form fasilitas
  const handleFacilityFormSubmit = (e) => {
    e.preventDefault()
    // Logika untuk menyimpan data fasilitas
    setShowFacilityForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="mt-2 text-gray-600">Kelola data pengguna dan operasional fasilitas kesehatan</p>
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
                <span className="font-medium">Pendaftaran Baru</span>
                <span className="text-xs text-muted-foreground">15 pendaftaran menunggu verifikasi</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Pembaruan Sistem</span>
                <span className="text-xs text-muted-foreground">Versi baru tersedia (v2.1.0)</span>
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
          <AlertTitle className="text-blue-800">Informasi Sistem</AlertTitle>
          <AlertDescription className="text-blue-700">
            Terdapat 15 pendaftaran baru yang menunggu verifikasi. Silakan periksa tab Verifikasi Pendaftaran.
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

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Jumlah Dokter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.totalDoctors}</div>
              <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-2">
                <Stethoscope className="h-5 w-5 text-[#3FB6F6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Jumlah Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.totalPatients}</div>
              <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-2">
                <Users className="h-5 w-5 text-[#3FB6F6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kunjungan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.totalVisitsToday}</div>
              <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-2">
                <Calendar className="h-5 w-5 text-[#3FB6F6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pendaftaran Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.pendingRegistrations}</div>
              <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-2">
                <FileCheck className="h-5 w-5 text-[#3FB6F6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigasi Fitur Utama */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "users" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Users className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Manajemen Pengguna</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "facilities" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("facilities")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <HospitalSquare className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Data Fasilitas</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "schedules" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("schedules")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Calendar className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Jadwal Dokter</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "medical-records" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("medical-records")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <FileText className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Data Rekam Medis</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "verifications" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("verifications")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <FileCheck className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Verifikasi Pendaftaran</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "distributions" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("distributions")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <LayoutDashboard className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Distribusi Poli</CardTitle>
          </CardContent>
        </Card>

        <Card
          className={`hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer ${activeTab === "settings" ? "border-[#3FB6F6] bg-blue-50" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
              <Settings className="h-6 w-6 text-[#3FB6F6]" />
            </div>
            <CardTitle className="text-base">Pengaturan Sistem</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Konten Tab */}
      <div className="space-y-6">
        {/* Tab Manajemen Pengguna */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Cari pengguna..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="doctor">Dokter</SelectItem>
                    <SelectItem value="patient">Pasien</SelectItem>
                    <SelectItem value="director">Direktur</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                  onClick={() => {
                    setSelectedUser(null)
                    setShowUserForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Tambah Pengguna</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Nomor Induk</TableHead>
                      <TableHead>Fasilitas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.nomorInduk}</TableCell>
                        <TableCell>{user.fasilitas}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Form Dialog untuk Tambah/Edit Pengguna */}
            <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
                  <DialogDescription>
                    {selectedUser
                      ? "Edit informasi pengguna yang sudah ada"
                      : "Isi formulir berikut untuk menambahkan pengguna baru ke sistem"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input id="nama" placeholder="Masukkan nama lengkap" defaultValue={selectedUser?.nama || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@contoh.com"
                        defaultValue={selectedUser?.email || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue={selectedUser?.role?.toLowerCase() || "pasien"}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dokter">Dokter</SelectItem>
                          <SelectItem value="pasien">Pasien</SelectItem>
                          <SelectItem value="direktur">Direktur</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomorInduk">Nomor Induk</Label>
                      <Input
                        id="nomorInduk"
                        placeholder="Masukkan nomor induk"
                        defaultValue={selectedUser?.nomorInduk || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fasilitas">Fasilitas Terkait</Label>
                      <Select defaultValue={selectedUser?.fasilitas || "none"}>
                        <SelectTrigger id="fasilitas">
                          <SelectValue placeholder="Pilih fasilitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          <SelectItem value="RS HealthSync">RS HealthSync</SelectItem>
                          <SelectItem value="Puskesmas Sejahtera">Puskesmas Sejahtera</SelectItem>
                          <SelectItem value="Klinik Bahagia">Klinik Bahagia</SelectItem>
                          <SelectItem value="RS Sehat Sentosa">RS Sehat Sentosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue={selectedUser?.status?.toLowerCase() || "aktif"}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="nonaktif">Nonaktif</SelectItem>
                          <SelectItem value="diblokir">Diblokir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {!selectedUser && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUserForm(false)}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                    >
                      {selectedUser ? "Simpan Perubahan" : "Tambah Pengguna"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Tab Data Fasilitas Kesehatan */}
        {activeTab === "facilities" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Data Fasilitas Kesehatan</h2>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Cari fasilitas..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="rs">Rumah Sakit</SelectItem>
                    <SelectItem value="puskesmas">Puskesmas</SelectItem>
                    <SelectItem value="klinik">Klinik</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                  onClick={() => setShowFacilityForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Tambah Fasilitas</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Nama Fasilitas</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Layanan</TableHead>
                      <TableHead>Nomor Izin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilityData.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{facility.nama}</TableCell>
                        <TableCell>{facility.jenis}</TableCell>
                        <TableCell>{facility.alamat}</TableCell>
                        <TableCell>{facility.layanan}</TableCell>
                        <TableCell>{facility.nomorIzin}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(facility.status)}>{facility.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Form Dialog untuk Tambah/Edit Fasilitas */}
            <Dialog open={showFacilityForm} onOpenChange={setShowFacilityForm}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Tambah Fasilitas Kesehatan Baru</DialogTitle>
                  <DialogDescription>
                    Isi formulir berikut untuk menambahkan fasilitas kesehatan baru ke sistem
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFacilityFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="namaFasilitas">Nama Fasilitas</Label>
                      <Input id="namaFasilitas" placeholder="Masukkan nama fasilitas" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenisFasilitas">Jenis Fasilitas</Label>
                      <Select defaultValue="rs">
                        <SelectTrigger id="jenisFasilitas">
                          <SelectValue placeholder="Pilih jenis fasilitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rs">Rumah Sakit</SelectItem>
                          <SelectItem value="puskesmas">Puskesmas</SelectItem>
                          <SelectItem value="klinik">Klinik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="alamat">Alamat</Label>
                      <Input id="alamat" placeholder="Masukkan alamat lengkap" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="layanan">Layanan</Label>
                      <Input id="layanan" placeholder="Contoh: Umum, Spesialis, IGD 24 Jam" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomorIzin">Nomor Izin</Label>
                      <Input id="nomorIzin" placeholder="Masukkan nomor izin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statusFasilitas">Status</Label>
                      <Select defaultValue="aktif">
                        <SelectTrigger id="statusFasilitas">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowFacilityForm(false)}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                    >
                      Tambah Fasilitas
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Tab Jadwal Dokter */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Jadwal Dokter</h2>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Cari dokter..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter Poli" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Poli</SelectItem>
                    <SelectItem value="umum">Poli Umum</SelectItem>
                    <SelectItem value="dalam">Poli Penyakit Dalam</SelectItem>
                    <SelectItem value="anak">Poli Anak</SelectItem>
                    <SelectItem value="mata">Poli Mata</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Jadwal</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Nama Dokter</TableHead>
                      <TableHead>Poli</TableHead>
                      <TableHead>Senin</TableHead>
                      <TableHead>Selasa</TableHead>
                      <TableHead>Rabu</TableHead>
                      <TableHead>Kamis</TableHead>
                      <TableHead>Jumat</TableHead>
                      <TableHead>Sabtu</TableHead>
                      <TableHead>Minggu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorScheduleData.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{schedule.nama}</TableCell>
                        <TableCell>{schedule.poli}</TableCell>
                        <TableCell>{schedule.senin}</TableCell>
                        <TableCell>{schedule.selasa}</TableCell>
                        <TableCell>{schedule.rabu}</TableCell>
                        <TableCell>{schedule.kamis}</TableCell>
                        <TableCell>{schedule.jumat}</TableCell>
                        <TableCell>{schedule.sabtu}</TableCell>
                        <TableCell>{schedule.minggu}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Verifikasi Pendaftaran */}
        {activeTab === "verifications" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Verifikasi Pendaftaran</h2>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Cari pendaftar..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="doctor">Dokter</SelectItem>
                    <SelectItem value="patient">Pasien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationData.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{registration.nama}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.tanggal}</TableCell>
                        <TableCell>{registration.role}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(registration.status)}>{registration.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Lihat Detail</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">Terima</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Tolak</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Data Rekam Medis */}
        {activeTab === "medical-records" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Data Rekam Medis</h2>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Cari pasien..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter Poli" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Poli</SelectItem>
                    <SelectItem value="umum">Poli Umum</SelectItem>
                    <SelectItem value="dalam">Poli Penyakit Dalam</SelectItem>
                    <SelectItem value="anak">Poli Anak</SelectItem>
                    <SelectItem value="mata">Poli Mata</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Dokter</TableHead>
                      <TableHead>Poli</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitData.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{visit.tanggal}</TableCell>
                        <TableCell className="font-medium">{visit.pasien}</TableCell>
                        <TableCell>{visit.dokter}</TableCell>
                        <TableCell>{visit.poli}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Lihat Detail</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Distribusi Poli */}
        {activeTab === "distributions" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Distribusi Poli & Ruangan</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit Distribusi</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Distribusi</CardTitle>
                <CardDescription>
                  Halaman ini masih dalam pengembangan. Silakan kembali nanti untuk melihat informasi tentang distribusi
                  poli dan ruangan.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-6 text-center">
                  <LayoutDashboard className="mx-auto h-10 w-10 text-[#3FB6F6]" />
                  <p className="mt-4 text-lg font-medium">Fitur Sedang Dikembangkan</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tim pengembang sedang bekerja untuk menyelesaikan halaman ini. Silakan kembali nanti.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Pengaturan Sistem */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Pengaturan Sistem</h2>
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                <span>Simpan Perubahan</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengaturan</CardTitle>
                <CardDescription>
                  Halaman ini masih dalam pengembangan. Silakan kembali nanti untuk melihat informasi tentang pengaturan
                  sistem.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-6 text-center">
                  <Settings className="mx-auto h-10 w-10 text-[#3FB6F6]" />
                  <p className="mt-4 text-lg font-medium">Fitur Sedang Dikembangkan</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tim pengembang sedang bekerja untuk menyelesaikan halaman ini. Silakan kembali nanti.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
