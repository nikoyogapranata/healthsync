"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Settings,
  AlertCircle,
  ChevronRight,
  Bell,
  User,
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

export function DashboardPasien() {
  const [showNotification, setShowNotification] = useState(true)

  // Data pasien contoh
  const pasienData = {
    nama: "Ahmad Fauzi",
    totalKunjungan: 12,
    diagnosaTerakhir: "Diabetes Mellitus Tipe 2",
    dokterTerakhir: "dr. Budi Santoso, Sp.PD",
    tanggalTerakhir: "12 Maret 2023",
  }

  // Data antrian contoh
  const antrianData = {
    nomorAntrian: "A-17",
    layanan: "Poli Umum",
    tanggal: "15 April 2023",
    jam: "10:30 WIB",
    status: "Menunggu", // Menunggu, Dipanggil, Selesai
  }

  // Fungsi untuk mendapatkan warna status antrian
  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Dipanggil":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, {pasienData.nama}!</h1>
          <p className="mt-2 text-gray-600">Kelola kesehatan Anda dengan mudah di satu tempat</p>
        </div>
        <div className="flex items-center gap-2">
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
                <span className="font-medium">Pengingat Janji Temu</span>
                <span className="text-xs text-muted-foreground">Besok, 10:30 WIB - Poli Umum</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Hasil Lab Tersedia</span>
                <span className="text-xs text-muted-foreground">Hari ini, 08:15 WIB</span>
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

      {showNotification && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Pengingat Janji Temu</AlertTitle>
          <AlertDescription className="text-blue-700">
            Anda memiliki janji temu dengan dr. Budi Santoso pada tanggal 15 April 2023 pukul 10:30 WIB di Poli Umum.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-blue-800 hover:text-blue-900 hover:bg-blue-100"
            onClick={() => setShowNotification(false)}
          >
            &times;
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Kartu Status Antrian */}
        <Card className="border-l-4 border-l-[#3FB6F6] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status Antrian Terbaru</CardTitle>
            <CardDescription>Informasi antrian Anda saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Nomor Antrian</p>
                  <p className="text-2xl font-bold text-[#3FB6F6]">{antrianData.nomorAntrian}</p>
                </div>
                <Badge className={getStatusColor(antrianData.status)}>{antrianData.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Layanan</p>
                  <p>{antrianData.layanan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Tanggal & Jam</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p>
                      {antrianData.tanggal}, {antrianData.jam}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/antrian" passHref>
              <Button variant="ghost" className="p-0 h-auto text-[#3FB6F6] hover:text-[#34D399]">
                <span>Lihat Detail Antrian</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Kartu Ringkasan Rekam Medis */}
        <Card className="border-l-4 border-l-[#34D399] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ringkasan Rekam Medis</CardTitle>
            <CardDescription>Informasi kesehatan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Kunjungan</p>
                  <p className="text-2xl font-bold text-[#34D399]">{pasienData.totalKunjungan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Kunjungan Terakhir</p>
                  <p>{pasienData.tanggalTerakhir}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Diagnosa Terakhir</p>
                <p>{pasienData.diagnosaTerakhir}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Dokter</p>
                <p>{pasienData.dokterTerakhir}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/rekam-medis" passHref>
              <Button variant="ghost" className="p-0 h-auto text-[#34D399] hover:text-[#3FB6F6]">
                <span>Lihat Rekam Medis</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Menu Navigasi Cepat</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link href="/antrian" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Buat Janji Temu</CardTitle>
                <CardDescription className="text-xs mt-1">Atur jadwal kunjungan Anda</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rekam-medis" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <FileText className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Rekam Medis</CardTitle>
                <CardDescription className="text-xs mt-1">Lihat riwayat kesehatan Anda</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/riwayat" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <ClipboardList className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Riwayat Janji Temu</CardTitle>
                <CardDescription className="text-xs mt-1">Lihat riwayat kunjungan Anda</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pengaturan" passHref>
            <Card className="hover:border-[#3FB6F6] hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-3 mb-3">
                  <Settings className="h-6 w-6 text-[#3FB6F6]" />
                </div>
                <CardTitle className="text-base">Pengaturan Akun</CardTitle>
                <CardDescription className="text-xs mt-1">Kelola profil dan preferensi</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Pengumuman Terbaru</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">Baru</Badge>
                  <h3 className="font-medium">Layanan Telemedicine Tersedia</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Kini Anda dapat berkonsultasi dengan dokter secara online melalui fitur telemedicine kami. Layanan ini
                  tersedia untuk semua pasien HealthSync.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>
                  <h3 className="font-medium">Jam Operasional Libur Lebaran</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Selama libur Lebaran tanggal 10-15 April 2023, kami hanya melayani kasus darurat. Layanan normal akan
                  kembali beroperasi pada tanggal 16 April 2023.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium mb-2">Bantuan</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/bantuan" className="hover:text-[#3FB6F6]">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#3FB6F6]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Kontak</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Telepon: (021) 1234-5678</li>
              <li>Email: info@healthsync.id</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Kebijakan</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/privasi" className="hover:text-[#3FB6F6]">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat" className="hover:text-[#3FB6F6]">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>&copy; 2023 HealthSync. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
