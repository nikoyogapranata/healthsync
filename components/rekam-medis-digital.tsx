"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  FileText,
  Pill,
  Microscope,
  FileType,
  Syringe,
  User,
  Download,
  Printer,
  Eye,
  AlertCircle,
  Plus,
  Calendar,
  ArrowLeft,
  Clock,
  CheckCircle2,
} from "lucide-react"

export function RekamMedisDigital() {
  const [showNewDiagnosaForm, setShowNewDiagnosaForm] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [userRole, setUserRole] = useState("dokter") // Bisa diubah ke "pasien" untuk testing
  const [activeTab, setActiveTab] = useState("diagnosa")
  const [showEditProfile, setShowEditProfile] = useState(false)

  // Data pasien contoh
  const pasienData = {
    nama: "Ahmad Fauzi",
    nik: "3275012504890002",
    tanggalLahir: "25 April 1989",
    jenisKelamin: "Laki-laki",
    golonganDarah: "O+",
    alergi: "Penisilin, Udang",
    noHP: "081234567890",
    email: "ahmad.fauzi@email.com",
    alamat: "Jl. Merdeka No. 123, Jakarta Selatan",
    statusBPJS: "Aktif",
    riwayatPenyakitKronis: "Hipertensi",
  }

  // Data diagnosa contoh
  const diagnosaData = [
    {
      id: 1,
      tanggal: "12 Maret 2023",
      waktu: "14:30",
      dokter: "dr. Budi Santoso, Sp.PD",
      diagnosa: "Diabetes Mellitus Tipe 2",
      tindakan: "Pengaturan diet, Metformin 500mg 2x1",
      catatan: "Pasien perlu kontrol rutin setiap bulan untuk memantau kadar gula darah",
      butuhKontrol: true,
    },
    {
      id: 2,
      tanggal: "5 Januari 2023",
      waktu: "10:15",
      dokter: "dr. Rina Wijaya, Sp.JP",
      diagnosa: "Hipertensi Grade 1",
      tindakan: "Amlodipine 5mg 1x1, Pengurangan asupan garam",
      catatan: "Pasien disarankan untuk melakukan pemantauan tekanan darah di rumah",
      butuhKontrol: true,
    },
    {
      id: 3,
      tanggal: "20 November 2022",
      waktu: "09:45",
      dokter: "dr. Dian Purnama, Sp.PD",
      diagnosa: "ISPA",
      tindakan: "Amoxicillin 500mg 3x1, Istirahat cukup",
      catatan: "Pasien disarankan untuk banyak minum air putih dan istirahat",
      butuhKontrol: false,
    },
  ]

  // Data resep obat contoh
  const resepData = [
    {
      id: 1,
      tanggal: "12 Maret 2023",
      waktu: "14:45",
      dokter: "dr. Budi Santoso, Sp.PD",
      obat: "Metformin 500mg",
      dosis: "2x1 setelah makan",
      durasi: "30 hari",
      catatan: "Diminum setelah makan pagi dan malam",
    },
    {
      id: 2,
      tanggal: "12 Maret 2023",
      waktu: "14:45",
      dokter: "dr. Budi Santoso, Sp.PD",
      obat: "Vitamin B Complex",
      dosis: "1x1 setelah makan",
      durasi: "30 hari",
      catatan: "Diminum setelah makan pagi",
    },
    {
      id: 3,
      tanggal: "5 Januari 2023",
      waktu: "10:30",
      dokter: "dr. Rina Wijaya, Sp.JP",
      obat: "Amlodipine 5mg",
      dosis: "1x1 malam hari",
      durasi: "30 hari",
      catatan: "Diminum setelah makan malam",
    },
    {
      id: 4,
      tanggal: "20 November 2022",
      waktu: "10:00",
      dokter: "dr. Dian Purnama, Sp.PD",
      obat: "Amoxicillin 500mg",
      dosis: "3x1 setelah makan",
      durasi: "5 hari",
      catatan: "Harus dihabiskan meskipun sudah merasa sembuh",
    },
    {
      id: 5,
      tanggal: "20 November 2022",
      waktu: "10:00",
      dokter: "dr. Dian Purnama, Sp.PD",
      obat: "Paracetamol 500mg",
      dosis: "3x1 jika demam",
      durasi: "5 hari",
      catatan: "Diminum jika suhu tubuh di atas 38°C",
    },
  ]

  // Data hasil pemeriksaan contoh
  const hasilPemeriksaanData = [
    {
      id: 1,
      tanggal: "12 Maret 2023",
      waktu: "13:30",
      jenis: "Laboratorium",
      nama: "Gula Darah Puasa",
      hasil: "140 mg/dL",
      catatan: "Di atas normal, perlu pengaturan diet",
      file: "hasil_lab_gula_darah.pdf",
      dokter: "dr. Budi Santoso, Sp.PD",
      faskes: "RS Sehat Sentosa",
    },
    {
      id: 2,
      tanggal: "12 Maret 2023",
      waktu: "13:30",
      jenis: "Laboratorium",
      nama: "HbA1c",
      hasil: "7.2%",
      catatan: "Kontrol diabetes belum optimal",
      file: "hasil_lab_hba1c.pdf",
      dokter: "dr. Budi Santoso, Sp.PD",
      faskes: "RS Sehat Sentosa",
    },
    {
      id: 3,
      tanggal: "5 Januari 2023",
      waktu: "09:15",
      jenis: "Laboratorium",
      nama: "Profil Lipid",
      hasil: "Kolesterol Total: 220 mg/dL",
      catatan: "Kolesterol sedikit tinggi, perlu diet rendah lemak",
      file: "hasil_lab_lipid.pdf",
      dokter: "dr. Rina Wijaya, Sp.JP",
      faskes: "RS Sehat Sentosa",
    },
    {
      id: 4,
      tanggal: "5 Januari 2023",
      waktu: "11:00",
      jenis: "Radiologi",
      nama: "Rontgen Dada",
      hasil: "Normal",
      catatan: "Tidak ada kelainan pada jantung dan paru",
      file: "hasil_rontgen_dada.pdf",
      dokter: "dr. Rina Wijaya, Sp.JP",
      faskes: "RS Sehat Sentosa",
    },
  ]

  // Data catatan medis lain contoh
  const catatanMedisData = [
    {
      id: 1,
      tanggal: "12 Maret 2023",
      waktu: "14:50",
      dokter: "dr. Budi Santoso, Sp.PD",
      catatan:
        "Pasien mengeluhkan sering haus dan sering buang air kecil. Disarankan untuk melakukan olahraga ringan 30 menit setiap hari.",
      faskes: "RS Sehat Sentosa",
    },
    {
      id: 2,
      tanggal: "5 Januari 2023",
      waktu: "10:45",
      dokter: "dr. Rina Wijaya, Sp.JP",
      catatan:
        "Pasien mengeluhkan sakit kepala. Tekanan darah 150/90 mmHg. Disarankan untuk mengurangi konsumsi garam dan melakukan pemantauan tekanan darah di rumah.",
      faskes: "RS Sehat Sentosa",
    },
  ]

  // Data vaksinasi contoh
  const vaksinasiData = [
    {
      id: 1,
      tanggal: "15 Februari 2022",
      waktu: "09:30",
      jenis: "COVID-19",
      nama: "Sinovac",
      dosis: "Dosis 1",
      lokasi: "Puskesmas Sejahtera",
      petugas: "dr. Anita Sari",
    },
    {
      id: 2,
      tanggal: "15 Maret 2022",
      waktu: "10:15",
      jenis: "COVID-19",
      nama: "Sinovac",
      dosis: "Dosis 2",
      lokasi: "Puskesmas Sejahtera",
      petugas: "dr. Anita Sari",
    },
    {
      id: 3,
      tanggal: "10 Januari 2023",
      waktu: "13:45",
      jenis: "COVID-19",
      nama: "Pfizer",
      dosis: "Booster",
      lokasi: "RS Sehat Sentosa",
      petugas: "dr. Rudi Hartono",
    },
    {
      id: 4,
      tanggal: "5 Mei 2022",
      waktu: "11:00",
      jenis: "Influenza",
      nama: "Vaxigrip",
      dosis: "Tahunan",
      lokasi: "Klinik Bahagia",
      petugas: "dr. Maya Indah",
    },
  ]

  // Fungsi untuk menambahkan diagnosa baru
  const handleAddDiagnosa = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Diagnosa Berhasil Ditambahkan",
      description: "Data diagnosa baru telah disimpan dalam sistem",
      duration: 3000,
    })
    setShowNewDiagnosaForm(false)
  }

  // Fungsi untuk menambahkan resep baru
  const handleAddResep = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Resep Berhasil Ditambahkan",
      description: "Data resep obat baru telah disimpan dalam sistem",
      duration: 3000,
    })
  }

  // Fungsi untuk menambahkan hasil pemeriksaan baru
  const handleAddHasilPemeriksaan = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Hasil Pemeriksaan Berhasil Ditambahkan",
      description: "Data hasil pemeriksaan baru telah disimpan dalam sistem",
      duration: 3000,
    })
  }

  // Fungsi untuk menambahkan catatan medis baru
  const handleAddCatatanMedis = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Catatan Medis Berhasil Ditambahkan",
      description: "Data catatan medis baru telah disimpan dalam sistem",
      duration: 3000,
    })
  }

  // Fungsi untuk menambahkan vaksinasi baru
  const handleAddVaksinasi = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Riwayat Vaksinasi Berhasil Ditambahkan",
      description: "Data vaksinasi baru telah disimpan dalam sistem",
      duration: 3000,
    })
  }

  // Fungsi untuk mengunduh rekam medis
  const handleDownloadRekamMedis = () => {
    toast({
      title: "Mengunduh Rekam Medis",
      description: "Rekam medis lengkap sedang diunduh dalam format PDF",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-2 -ml-4 flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Rekam Medis Digital</h1>
          <p className="mt-2 text-gray-600">Lihat dan kelola data kesehatan pasien</p>
        </div>
      </div>

      {/* Notifikasi */}
      {showNotification && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Informasi</AlertTitle>
          <AlertDescription className="text-blue-700">
            Hasil pemeriksaan laboratorium terbaru telah ditambahkan oleh RS Sehat Sentosa pada 12 Maret 2023.
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

      {/* Kartu Informasi Pasien */}
      <Card className="border-l-4 border-l-[#3FB6F6]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Informasi Pasien</CardTitle>
              <CardDescription>Data pribadi dan riwayat kesehatan</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>Lihat Profil Lengkap</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Profil Lengkap Pasien</DialogTitle>
                  <DialogDescription>Informasi detail pasien</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{pasienData.nama}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">NIK</p>
                    <p>{pasienData.nik}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                    <p>{pasienData.tanggalLahir}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                    <p>{pasienData.jenisKelamin}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Golongan Darah</p>
                    <p>{pasienData.golonganDarah}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">No. HP</p>
                    <p>{pasienData.noHP}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{pasienData.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status BPJS</p>
                    <p>{pasienData.statusBPJS}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Alamat</p>
                    <p>{pasienData.alamat}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Riwayat Penyakit Kronis</p>
                    <p>{pasienData.riwayatPenyakitKronis || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Alergi</p>
                    <div className="flex flex-wrap gap-1">
                      {pasienData.alergi.split(", ").map((alergi, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {alergi}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500 italic">* Data profil hanya dapat diubah oleh Admin Faskes</p>
                  {(userRole === "admin" || userRole === "dokter") && (
                    <Button
                      onClick={() => setShowEditProfile(true)}
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                    >
                      Edit Profil
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
              <p className="font-medium">{pasienData.nama}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">NIK</p>
              <p>{pasienData.nik}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
              <p>{pasienData.tanggalLahir}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
              <p>{pasienData.jenisKelamin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Golongan Darah</p>
              <p>{pasienData.golonganDarah}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Alergi</p>
              <div className="flex flex-wrap gap-1">
                {pasienData.alergi.split(", ").map((alergi, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {alergi}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Profil Pasien</DialogTitle>
            <DialogDescription>Ubah informasi profil pasien</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editNama">Nama Lengkap</Label>
                <Input id="editNama" defaultValue={pasienData.nama} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNIK">NIK</Label>
                <Input id="editNIK" defaultValue={pasienData.nik} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTanggalLahir">Tanggal Lahir</Label>
                <Input id="editTanggalLahir" defaultValue={pasienData.tanggalLahir} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editJenisKelamin">Jenis Kelamin</Label>
                <Input id="editJenisKelamin" defaultValue={pasienData.jenisKelamin} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editGolonganDarah">Golongan Darah</Label>
                <Input id="editGolonganDarah" defaultValue={pasienData.golonganDarah} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNoHP">No. HP</Label>
                <Input id="editNoHP" defaultValue={pasienData.noHP} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" defaultValue={pasienData.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatusBPJS">Status BPJS</Label>
                <Input id="editStatusBPJS" defaultValue={pasienData.statusBPJS} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="editAlamat">Alamat</Label>
                <Textarea id="editAlamat" defaultValue={pasienData.alamat} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRiwayatPenyakit">Riwayat Penyakit Kronis</Label>
                <Input id="editRiwayatPenyakit" defaultValue={pasienData.riwayatPenyakitKronis} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAlergi">Alergi</Label>
                <Input id="editAlergi" defaultValue={pasienData.alergi} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                Batal
              </Button>
              <Button
                className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                onClick={() => {
                  toast({
                    title: "Profil Berhasil Diperbarui",
                    description: "Data profil pasien telah diperbarui",
                    duration: 3000,
                  })
                  setShowEditProfile(false)
                }}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tab Navigasi */}
      <Tabs defaultValue="diagnosa" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 sticky top-0 z-10 bg-white">
          <TabsTrigger value="diagnosa" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Diagnosa</span>
          </TabsTrigger>
          <TabsTrigger value="resep" className="flex items-center gap-2">
            <Pill size={16} />
            <span>Resep Obat</span>
          </TabsTrigger>
          <TabsTrigger value="hasil" className="flex items-center gap-2">
            <Microscope size={16} />
            <span>Hasil Pemeriksaan</span>
          </TabsTrigger>
          <TabsTrigger value="catatan" className="flex items-center gap-2">
            <FileType size={16} />
            <span>Catatan Medis</span>
          </TabsTrigger>
          <TabsTrigger value="vaksinasi" className="flex items-center gap-2">
            <Syringe size={16} />
            <span>Riwayat Vaksinasi</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Diagnosa */}
        <TabsContent value="diagnosa" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Riwayat Diagnosa</h3>
            {userRole === "dokter" && (
              <Button
                onClick={() => setShowNewDiagnosaForm(!showNewDiagnosaForm)}
                className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
              >
                <Plus size={16} className="mr-2" />
                Tambahkan Diagnosa Baru
              </Button>
            )}
          </div>

          {showNewDiagnosaForm && userRole === "dokter" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tambah Diagnosa Baru</CardTitle>
                <CardDescription>Masukkan informasi diagnosa pasien</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleAddDiagnosa}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tanggal">Tanggal</Label>
                      <div className="flex">
                        <Input id="tanggal" type="date" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dokter">Dokter</Label>
                      <Input id="dokter" placeholder="Nama dokter" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosa">Diagnosa</Label>
                    <Input id="diagnosa" placeholder="Masukkan diagnosa" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tindakan">Tindakan yang Diberikan</Label>
                    <Textarea id="tindakan" placeholder="Deskripsikan tindakan yang diberikan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catatan">Catatan Tambahan</Label>
                    <Textarea id="catatan" placeholder="Catatan tambahan jika ada" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="kontrol" />
                    <Label htmlFor="kontrol">Butuh kontrol lanjutan</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewDiagnosaForm(false)}>
                  Batal
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                  onClick={handleAddDiagnosa}
                >
                  Simpan Diagnosa
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Diagnosa</TableHead>
                  <TableHead>Tindakan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnosaData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.tanggal}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {item.waktu}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.dokter}</TableCell>
                    <TableCell>{item.diagnosa}</TableCell>
                    <TableCell>{item.tindakan}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                            <span className="sr-only">Lihat Detail</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detail Diagnosa</DialogTitle>
                            <DialogDescription>Informasi lengkap diagnosa pasien</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Tanggal & Waktu</h4>
                                <p>
                                  {item.tanggal}, {item.waktu}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Dokter</h4>
                                <p>{item.dokter}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Diagnosa</h4>
                              <p>{item.diagnosa}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Tindakan</h4>
                              <p>{item.tindakan}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Catatan Tambahan</h4>
                              <p>{item.catatan}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <h4 className="text-sm font-medium text-gray-500">Butuh Kontrol Lanjutan:</h4>
                              {item.butuhKontrol ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ya</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Tidak</Badge>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab Resep Obat */}
        <TabsContent value="resep" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Riwayat Resep Obat</h3>
            <div className="flex gap-2">
              {userRole === "dokter" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                      <Plus size={16} className="mr-2" />
                      Tambah Resep Baru
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Resep Obat Baru</DialogTitle>
                      <DialogDescription>Masukkan informasi resep obat</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleAddResep}>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="tanggalResep">Tanggal</Label>
                          <Input id="tanggalResep" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="waktuResep">Waktu</Label>
                          <Input id="waktuResep" type="time" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dokterResep">Dokter</Label>
                          <Input id="dokterResep" placeholder="Nama dokter" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="obat">Nama Obat</Label>
                          <Input id="obat" placeholder="Masukkan nama obat" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dosis">Dosis</Label>
                          <Input id="dosis" placeholder="Contoh: 2x1 setelah makan" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="durasi">Durasi</Label>
                          <Input id="durasi" placeholder="Contoh: 7 hari" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catatanResep">Catatan Tambahan</Label>
                        <Textarea id="catatanResep" placeholder="Catatan tambahan jika ada" />
                      </div>
                    </form>
                    <DialogFooter>
                      <Button variant="outline">Batal</Button>
                      <Button
                        className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                        onClick={handleAddResep}
                      >
                        Simpan Resep
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Printer size={16} />
                <span>Cetak Resep PDF</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Obat</TableHead>
                  <TableHead>Dosis</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resepData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.tanggal}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {item.waktu}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.obat}</TableCell>
                    <TableCell>{item.dosis}</TableCell>
                    <TableCell>{item.durasi}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                            <span className="sr-only">Lihat Detail</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detail Resep Obat</DialogTitle>
                            <DialogDescription>Informasi lengkap resep obat</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Tanggal & Waktu</h4>
                                <p>
                                  {item.tanggal}, {item.waktu}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Dokter</h4>
                                <p>{item.dokter}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Obat</h4>
                              <p>{item.obat}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Dosis</h4>
                              <p>{item.dosis}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Durasi</h4>
                              <p>{item.durasi}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Catatan</h4>
                              <p>{item.catatan}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                              <Printer size={16} />
                              <span>Cetak Resep Ini</span>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab Hasil Pemeriksaan */}
        <TabsContent value="hasil" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Hasil Pemeriksaan</h3>
            <div className="flex gap-2">
              {userRole === "dokter" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                      <Plus size={16} className="mr-2" />
                      Tambah Hasil Pemeriksaan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Hasil Pemeriksaan Baru</DialogTitle>
                      <DialogDescription>Masukkan informasi hasil pemeriksaan</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleAddHasilPemeriksaan}>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="tanggalPemeriksaan">Tanggal</Label>
                          <Input id="tanggalPemeriksaan" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="waktuPemeriksaan">Waktu</Label>
                          <Input id="waktuPemeriksaan" type="time" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dokterPemeriksaan">Dokter</Label>
                          <Input id="dokterPemeriksaan" placeholder="Nama dokter" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faskesPemeriksaan">Fasilitas Kesehatan</Label>
                          <Input id="faskesPemeriksaan" placeholder="Nama faskes" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jenisPemeriksaan">Jenis Pemeriksaan</Label>
                          <Input id="jenisPemeriksaan" placeholder="Contoh: Laboratorium, Radiologi" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="namaPemeriksaan">Nama Pemeriksaan</Label>
                          <Input id="namaPemeriksaan" placeholder="Contoh: Gula Darah Puasa, Rontgen Dada" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="hasilPemeriksaan">Hasil</Label>
                          <Textarea id="hasilPemeriksaan" placeholder="Masukkan hasil pemeriksaan" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catatanPemeriksaan">Catatan Dokter</Label>
                        <Textarea id="catatanPemeriksaan" placeholder="Catatan interpretasi hasil" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filePemeriksaan">Upload File Hasil</Label>
                        <Input id="filePemeriksaan" type="file" />
                      </div>
                    </form>
                    <DialogFooter>
                      <Button variant="outline">Batal</Button>
                      <Button
                        className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                        onClick={handleAddHasilPemeriksaan}
                      >
                        Simpan Hasil Pemeriksaan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                <span>Unduh Semua Hasil</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hasilPemeriksaanData.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{item.jenis}</Badge>
                      <CardTitle className="text-lg">{item.nama}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar size={14} /> {item.tanggal}, <Clock size={14} /> {item.waktu}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download size={14} className="mr-1" />
                      <span>Unduh</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Hasil</h4>
                      <p className="font-medium">{item.hasil}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Catatan Dokter</h4>
                      <p>{item.catatan}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <User size={12} /> {item.dokter} | {item.faskes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Catatan Medis */}
        <TabsContent value="catatan" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Catatan Medis Lain</h3>
            {userRole === "dokter" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                    <Plus size={16} className="mr-2" />
                    Tambah Catatan Medis
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Catatan Medis Baru</DialogTitle>
                    <DialogDescription>Masukkan informasi catatan medis</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleAddCatatanMedis}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tanggalCatatan">Tanggal</Label>
                        <Input id="tanggalCatatan" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waktuCatatan">Waktu</Label>
                        <Input id="waktuCatatan" type="time" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dokterCatatan">Dokter</Label>
                        <Input id="dokterCatatan" placeholder="Nama dokter" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faskesCatatan">Fasilitas Kesehatan</Label>
                        <Input id="faskesCatatan" placeholder="Nama faskes" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isiCatatan">Catatan Medis</Label>
                      <Textarea id="isiCatatan" placeholder="Masukkan catatan medis" rows={5} required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tindakLanjut" />
                      <Label htmlFor="tindakLanjut">Memerlukan tindak lanjut</Label>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button variant="outline">Batal</Button>
                    <Button
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                      onClick={handleAddCatatanMedis}
                    >
                      Simpan Catatan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {catatanMedisData.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar size={14} /> {item.tanggal}, <Clock size={14} /> {item.waktu}
                      </CardDescription>
                      <CardTitle className="text-md">{item.dokter}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{item.catatan}</p>
                  <div className="text-xs text-gray-500 mt-2">{item.faskes}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Riwayat Vaksinasi */}
        <TabsContent value="vaksinasi" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Riwayat Vaksinasi</h3>
            {userRole === "dokter" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                    <Plus size={16} className="mr-2" />
                    Tambah Riwayat Vaksinasi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Riwayat Vaksinasi Baru</DialogTitle>
                    <DialogDescription>Masukkan informasi vaksinasi</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleAddVaksinasi}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tanggalVaksin">Tanggal</Label>
                        <Input id="tanggalVaksin" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waktuVaksin">Waktu</Label>
                        <Input id="waktuVaksin" type="time" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jenisVaksin">Jenis Vaksin</Label>
                        <Input id="jenisVaksin" placeholder="Contoh: COVID-19, Influenza" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="namaVaksin">Nama Vaksin</Label>
                        <Input id="namaVaksin" placeholder="Contoh: Sinovac, Pfizer" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dosisVaksin">Dosis</Label>
                        <Input id="dosisVaksin" placeholder="Contoh: Dosis 1, Booster" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lokasiVaksin">Lokasi</Label>
                        <Input id="lokasiVaksin" placeholder="Tempat vaksinasi" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petugasVaksin">Petugas</Label>
                        <Input id="petugasVaksin" placeholder="Nama petugas vaksinasi" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="noBatchVaksin">No. Batch Vaksin</Label>
                        <Input id="noBatchVaksin" placeholder="Nomor batch vaksin" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="catatanVaksin">Catatan</Label>
                      <Textarea id="catatanVaksin" placeholder="Catatan tambahan jika ada" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="efekSamping" />
                      <Label htmlFor="efekSamping">Ada efek samping</Label>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button variant="outline">Batal</Button>
                    <Button
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                      onClick={handleAddVaksinasi}
                    >
                      Simpan Vaksinasi
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Nama Vaksin</TableHead>
                  <TableHead>Dosis</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Petugas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaksinasiData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.tanggal}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {item.waktu}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.dosis}</TableCell>
                    <TableCell>{item.lokasi}</TableCell>
                    <TableCell>{item.petugas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadRekamMedis}>
          <Download size={16} />
          <span>Unduh Rekam Medis Lengkap (PDF)</span>
        </Button>

        <div className="text-sm text-gray-500 flex items-center gap-1">
          <CheckCircle2 size={16} className="text-green-500" />
          <span>Terakhir diperbarui: 12 Maret 2023, 14:50</span>
        </div>
      </div>
    </div>
  )
}
