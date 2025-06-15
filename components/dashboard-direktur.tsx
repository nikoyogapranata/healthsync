"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Download,
  Settings,
  AlertCircle,
  Bell,
  User,
  LogOut,
  Building,
  TrendingUp,
  Users,
  Filter,
  ArrowUpRight,
  BarChart3,
  PieChart,
  LineChartIcon,
  ArrowRight,
  Stethoscope,
  Activity,
  Pill,
  Send,
  HospitalIcon,
  ClipboardList,
  Megaphone,
  ChevronDown,
  Search,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Mail,
  X,
  Eye,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menggunakan dynamic import untuk komponen recharts agar tidak menyebabkan error di server side
const BarChart = dynamic(() => import("recharts").then((recharts) => recharts.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((recharts) => recharts.Bar), { ssr: false })
const LineChart = dynamic(() => import("recharts").then((recharts) => recharts.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((recharts) => recharts.Line), { ssr: false })
const PieChartRecharts = dynamic(() => import("recharts").then((recharts) => recharts.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((recharts) => recharts.Pie), { ssr: false })
const AreaChart = dynamic(() => import("recharts").then((recharts) => recharts.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then((recharts) => recharts.Area), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((recharts) => recharts.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((recharts) => recharts.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((recharts) => recharts.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((recharts) => recharts.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then((recharts) => recharts.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((recharts) => recharts.ResponsiveContainer), {
  ssr: false,
})
const Cell = dynamic(() => import("recharts").then((recharts) => recharts.Cell), { ssr: false })
const RadarChart = dynamic(() => import("recharts").then((recharts) => recharts.RadarChart), { ssr: false })
const PolarGrid = dynamic(() => import("recharts").then((recharts) => recharts.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import("recharts").then((recharts) => recharts.PolarAngleAxis), { ssr: false })
const PolarRadiusAxis = dynamic(() => import("recharts").then((recharts) => recharts.PolarRadiusAxis), { ssr: false })
const Radar = dynamic(() => import("recharts").then((recharts) => recharts.Radar), { ssr: false })
const Scatter = dynamic(() => import("recharts").then((recharts) => recharts.Scatter), { ssr: false })
const ScatterChart = dynamic(() => import("recharts").then((recharts) => recharts.ScatterChart), { ssr: false })
const ComposedChart = dynamic(() => import("recharts").then((recharts) => recharts.ComposedChart), { ssr: false })

export function DashboardDirektur() {
  const [showNotification, setShowNotification] = useState(true)
  const [timeRange, setTimeRange] = useState("bulan")
  const [activeTab, setActiveTab] = useState("overview")
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [showInsightDetail, setShowInsightDetail] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState(null)

  // Data untuk statistik utama
  const statsData = {
    totalPatients: 12480,
    totalVisitsThisMonth: 3245,
    activeDoctors: 48,
    activeFacilities: 12,
    patientGrowth: "+8.5%",
    visitGrowth: "+12.3%",
    doctorGrowth: "+2.1%",
    facilityGrowth: "0%",
  }

  // Data untuk grafik statistik pasien berdasarkan usia & jenis kelamin
  const ageGenderData = [
    { name: "0-10", Laki: 620, Perempuan: 580 },
    { name: "11-20", Laki: 785, Perempuan: 795 },
    { name: "21-30", Laki: 1080, Perempuan: 1210 },
    { name: "31-40", Laki: 1220, Perempuan: 1380 },
    { name: "41-50", Laki: 1050, Perempuan: 1130 },
    { name: "51-60", Laki: 890, Perempuan: 970 },
    { name: "60+", Laki: 710, Perempuan: 830 },
  ]

  // Data untuk grafik tren penyakit terbanyak
  const diseaseData = [
    { name: "Hipertensi", value: 25 },
    { name: "Diabetes", value: 18 },
    { name: "ISPA", value: 15 },
    { name: "Gastritis", value: 12 },
    { name: "Dermatitis", value: 8 },
    { name: "Lainnya", value: 22 },
  ]

  // Data untuk grafik kepadatan pelayanan
  const serviceData = [
    { name: "1 Apr", kunjungan: 98 },
    { name: "2 Apr", kunjungan: 102 },
    { name: "3 Apr", kunjungan: 110 },
    { name: "4 Apr", kunjungan: 105 },
    { name: "5 Apr", kunjungan: 100 },
    { name: "6 Apr", kunjungan: 90 },
    { name: "7 Apr", kunjungan: 75 },
    { name: "8 Apr", kunjungan: 88 },
    { name: "9 Apr", kunjungan: 92 },
    { name: "10 Apr", kunjungan: 85 },
    { name: "11 Apr", kunjungan: 95 },
    { name: "12 Apr", kunjungan: 82 },
    { name: "13 Apr", kunjungan: 78 },
    { name: "14 Apr", kunjungan: 70 },
    { name: "15 Apr", kunjungan: 80 },
    { name: "16 Apr", kunjungan: 85 },
    { name: "17 Apr", kunjungan: 90 },
    { name: "18 Apr", kunjungan: 95 },
    { name: "19 Apr", kunjungan: 100 },
    { name: "20 Apr", kunjungan: 105 },
    { name: "21 Apr", kunjungan: 98 },
    { name: "22 Apr", kunjungan: 92 },
    { name: "23 Apr", kunjungan: 88 },
    { name: "24 Apr", kunjungan: 85 },
    { name: "25 Apr", kunjungan: 80 },
    { name: "26 Apr", kunjungan: 78 },
    { name: "27 Apr", kunjungan: 75 },
    { name: "28 Apr", kunjungan: 80 },
    { name: "29 Apr", kunjungan: 85 },
    { name: "30 Apr", kunjungan: 90 },
  ]

  // Data untuk grafik distribusi jenis layanan
  const serviceTypeData = [
    { name: "Poli Umum", value: 38 },
    { name: "Poli Gigi", value: 22 },
    { name: "Poli Anak", value: 18 },
    { name: "Poli Mata", value: 12 },
    { name: "Poli KIA", value: 10 },
  ]

  // Data untuk grafik performa dokter
  const doctorPerformanceData = [
    { name: "dr. Budi", pasien: 120, durasi: 15, rujukan: 8 },
    { name: "dr. Siti", pasien: 95, durasi: 20, rujukan: 12 },
    { name: "dr. Andi", pasien: 110, durasi: 18, rujukan: 10 },
    { name: "dr. Dewi", pasien: 85, durasi: 22, rujukan: 15 },
    { name: "dr. Rudi", pasien: 75, durasi: 25, rujukan: 18 },
    { name: "dr. Maya", pasien: 105, durasi: 17, rujukan: 9 },
    { name: "dr. Joko", pasien: 90, durasi: 19, rujukan: 11 },
    { name: "dr. Nina", pasien: 80, durasi: 21, rujukan: 14 },
  ]

  // Data untuk grafik resep obat
  const medicineData = [
    { name: "Paracetamol", value: 28 },
    { name: "Amoxicillin", value: 22 },
    { name: "Omeprazole", value: 15 },
    { name: "Metformin", value: 12 },
    { name: "Amlodipine", value: 10 },
    { name: "Lainnya", value: 13 },
  ]

  // Data untuk tabel dokter aktif
  const activeDoctorsData = [
    {
      id: 1,
      nama: "dr. Budi Santoso, Sp.PD",
      spesialisasi: "Penyakit Dalam",
      poli: "Poli Penyakit Dalam",
      jadwal: "Senin, Rabu, Jumat (08:00-14:00)",
      pasienBulanan: 120,
      status: "Aktif",
    },
    {
      id: 2,
      nama: "dr. Siti Nurhaliza, Sp.A",
      spesialisasi: "Anak",
      poli: "Poli Anak",
      jadwal: "Senin, Selasa, Kamis (08:00-12:00)",
      pasienBulanan: 95,
      status: "Aktif",
    },
    {
      id: 3,
      nama: "dr. Andi Wijaya, Sp.JP",
      spesialisasi: "Jantung",
      poli: "Poli Jantung",
      jadwal: "Selasa, Kamis (13:00-17:00)",
      pasienBulanan: 110,
      status: "Aktif",
    },
    {
      id: 4,
      nama: "dr. Dewi Kartika, Sp.M",
      spesialisasi: "Mata",
      poli: "Poli Mata",
      jadwal: "Senin, Rabu, Jumat (13:00-17:00)",
      pasienBulanan: 85,
      status: "Aktif",
    },
    {
      id: 5,
      nama: "dr. Rudi Hermawan, Sp.OG",
      spesialisasi: "Kandungan",
      poli: "Poli KIA",
      jadwal: "Selasa, Kamis, Sabtu (08:00-12:00)",
      pasienBulanan: 75,
      status: "Cuti",
    },
  ]

  // Data untuk tabel jumlah pasien tiap poli
  const poliPatientsData = [
    { id: 1, poli: "Poli Umum", pasienHarian: 42, pasienBulanan: 1260, dokter: 8, status: "Normal" },
    { id: 2, poli: "Poli Gigi", pasienHarian: 25, pasienBulanan: 750, dokter: 5, status: "Normal" },
    { id: 3, poli: "Poli Anak", pasienHarian: 20, pasienBulanan: 600, dokter: 4, status: "Normal" },
    { id: 4, poli: "Poli Mata", pasienHarian: 15, pasienBulanan: 450, dokter: 3, status: "Normal" },
    { id: 5, poli: "Poli KIA", pasienHarian: 12, pasienBulanan: 360, dokter: 2, status: "Overload" },
    { id: 6, poli: "Poli Jantung", pasienHarian: 10, pasienBulanan: 300, dokter: 2, status: "Normal" },
    { id: 7, poli: "Poli Penyakit Dalam", pasienHarian: 18, pasienBulanan: 540, dokter: 3, status: "Normal" },
  ]

  // Data untuk tabel rangkuman kegiatan medis
  const medicalActivitiesData = [
    {
      id: 1,
      tanggal: "1-7 April 2025",
      kunjungan: 748,
      tindakanMedis: 520,
      rujukan: 42,
      resepObat: 680,
      status: "Normal",
    },
    {
      id: 2,
      tanggal: "8-14 April 2025",
      kunjungan: 782,
      tindakanMedis: 545,
      rujukan: 38,
      resepObat: 710,
      status: "Normal",
    },
    {
      id: 3,
      tanggal: "15-21 April 2025",
      kunjungan: 815,
      tindakanMedis: 570,
      rujukan: 45,
      resepObat: 740,
      status: "Tinggi",
    },
    {
      id: 4,
      tanggal: "22-28 April 2025",
      kunjungan: 790,
      tindakanMedis: 550,
      rujukan: 40,
      resepObat: 720,
      status: "Normal",
    },
  ]

  // Data untuk notifikasi & insight
  const insightsData = [
    {
      id: 1,
      judul: "Kepadatan Tinggi di Poli Gigi",
      deskripsi:
        "Terjadi peningkatan 25% kunjungan di Poli Gigi dalam 2 minggu terakhir. Pertimbangkan untuk menambah jadwal dokter gigi.",
      tanggal: "25 April 2025",
      tipe: "warning",
      detail:
        "Analisis menunjukkan peningkatan signifikan pada kunjungan Poli Gigi selama 2 minggu terakhir. Rata-rata waktu tunggu pasien meningkat dari 15 menit menjadi 35 menit. Rekomendasi: Tambahkan 1-2 dokter gigi atau perpanjang jam praktik dokter yang ada untuk mengurangi waktu tunggu pasien.",
    },
    {
      id: 2,
      judul: "Tren Peningkatan Kasus ISPA",
      deskripsi:
        "Terdeteksi peningkatan 18% kasus ISPA dalam sebulan terakhir. Perlu perhatian khusus dan stok obat yang memadai.",
      tanggal: "24 April 2025",
      tipe: "alert",
      detail:
        "Terjadi peningkatan kasus ISPA sebesar 18% dalam sebulan terakhir, terutama pada pasien anak-anak dan lansia. Faktor penyebab kemungkinan adalah perubahan cuaca dan peningkatan polusi udara. Rekomendasi: Tingkatkan stok obat terkait ISPA, siapkan ruang isolasi tambahan, dan lakukan kampanye kesehatan tentang pencegahan ISPA.",
    },
    {
      id: 3,
      judul: "Efisiensi Dokter Meningkat",
      deskripsi:
        "Rata-rata waktu konsultasi dokter menurun 12% dengan tingkat kepuasan pasien tetap tinggi. Indikasi efisiensi pelayanan.",
      tanggal: "22 April 2025",
      tipe: "success",
      detail:
        "Analisis kinerja dokter menunjukkan peningkatan efisiensi sebesar 12% dalam waktu konsultasi, sementara tingkat kepuasan pasien tetap di atas 90%. Faktor utama: implementasi sistem rekam medis elektronik dan pelatihan komunikasi efektif yang diadakan bulan lalu. Rekomendasi: Bagikan praktik terbaik ini ke seluruh staf medis dan pertimbangkan untuk memberikan insentif kepada dokter dengan performa terbaik.",
    },
    {
      id: 4,
      judul: "Stok Obat Antibiotik Menipis",
      deskripsi:
        "Stok beberapa jenis antibiotik hampir habis. Perlu segera melakukan pemesanan ulang untuk menghindari kekosongan.",
      tanggal: "21 April 2025",
      tipe: "warning",
      detail:
        "Stok antibiotik jenis Amoxicillin, Ciprofloxacin, dan Azithromycin hampir habis (tersisa <15% dari stok normal). Tingkat penggunaan meningkat 20% dibanding bulan sebelumnya. Rekomendasi: Segera lakukan pemesanan ulang dengan jumlah 30% lebih banyak dari biasanya dan evaluasi pola peresepan antibiotik untuk memastikan penggunaan yang rasional.",
    },
    {
      id: 5,
      judul: "Performa Fasilitas Menurun",
      deskripsi:
        "Klinik Bahagia menunjukkan penurunan kunjungan sebesar 15% dalam 3 bulan terakhir. Perlu evaluasi penyebabnya.",
      tanggal: "20 April 2025",
      tipe: "alert",
      detail:
        "Klinik Bahagia mengalami penurunan kunjungan sebesar 15% dalam 3 bulan terakhir. Survei kepuasan pasien menunjukkan penurunan dari 85% menjadi 70%. Keluhan utama: waktu tunggu yang lama dan kurangnya dokter spesialis. Rekomendasi: Lakukan audit internal, tambahkan dokter spesialis (terutama untuk poli anak dan penyakit dalam), dan tingkatkan sistem manajemen antrian.",
    },
  ]

  // Data untuk pengumuman internal
  const announcementsData = [
    {
      id: 1,
      judul: "Evaluasi Kinerja Triwulan II 2025",
      deskripsi:
        "Evaluasi kinerja triwulan II akan dilaksanakan pada tanggal 1 Mei 2025. Semua kepala departemen diminta menyiapkan laporan kinerja.",
      tanggal: "25 April 2025",
      penerima: "Semua Kepala Departemen",
      prioritas: "Tinggi",
    },
    {
      id: 2,
      judul: "Pelatihan Sistem Rekam Medis Elektronik Versi 2.0",
      deskripsi:
        "Pelatihan penggunaan sistem rekam medis elektronik versi terbaru akan dilaksanakan pada 5-6 Mei 2025. Wajib diikuti oleh semua dokter dan perawat.",
      tanggal: "23 April 2025",
      penerima: "Dokter, Perawat",
      prioritas: "Sedang",
    },
    {
      id: 3,
      judul: "Perubahan Prosedur Rujukan Pasien",
      deskripsi:
        "Mulai 10 Mei 2025, akan diberlakukan prosedur baru untuk rujukan pasien. Sosialisasi akan dilakukan pada 2 Mei 2025.",
      tanggal: "22 April 2025",
      penerima: "Semua Staf Medis",
      prioritas: "Sedang",
    },
  ]

  // Data untuk tren kunjungan tahunan
  const yearlyVisitData = [
    { name: "Jan", kunjungan: 2800 },
    { name: "Feb", kunjungan: 2950 },
    { name: "Mar", kunjungan: 3100 },
    { name: "Apr", kunjungan: 3245 },
    { name: "Mei", kunjungan: 0 },
    { name: "Jun", kunjungan: 0 },
    { name: "Jul", kunjungan: 0 },
    { name: "Agu", kunjungan: 0 },
    { name: "Sep", kunjungan: 0 },
    { name: "Okt", kunjungan: 0 },
    { name: "Nov", kunjungan: 0 },
    { name: "Des", kunjungan: 0 },
  ]

  // Data untuk perbandingan kunjungan tahun ini vs tahun lalu
  const yearComparisonData = [
    { name: "Jan", "Tahun 2025": 2800, "Tahun 2024": 2500 },
    { name: "Feb", "Tahun 2025": 2950, "Tahun 2024": 2600 },
    { name: "Mar", "Tahun 2025": 3100, "Tahun 2024": 2750 },
    { name: "Apr", "Tahun 2025": 3245, "Tahun 2024": 2850 },
    { name: "Mei", "Tahun 2025": 0, "Tahun 2024": 2900 },
    { name: "Jun", "Tahun 2025": 0, "Tahun 2024": 3000 },
    { name: "Jul", "Tahun 2025": 0, "Tahun 2024": 3100 },
    { name: "Agu", "Tahun 2025": 0, "Tahun 2024": 3050 },
    { name: "Sep", "Tahun 2025": 0, "Tahun 2024": 3150 },
    { name: "Okt", "Tahun 2025": 0, "Tahun 2024": 3200 },
    { name: "Nov", "Tahun 2025": 0, "Tahun 2024": 3100 },
    { name: "Des", "Tahun 2025": 0, "Tahun 2024": 3000 },
  ]

  // Data untuk grafik kepuasan pasien
  const patientSatisfactionData = [
    { name: "Jan", kepuasan: 85 },
    { name: "Feb", kepuasan: 87 },
    { name: "Mar", kepuasan: 86 },
    { name: "Apr", kepuasan: 89 },
  ]

  // Data untuk grafik waktu tunggu pasien
  const waitingTimeData = [
    { name: "Poli Umum", waktu: 25 },
    { name: "Poli Gigi", waktu: 35 },
    { name: "Poli Anak", waktu: 20 },
    { name: "Poli Mata", waktu: 30 },
    { name: "Poli KIA", waktu: 40 },
    { name: "Poli Jantung", waktu: 15 },
    { name: "Poli Penyakit Dalam", waktu: 25 },
  ]

  // Data untuk grafik distribusi pasien berdasarkan asuransi
  const insuranceData = [
    { name: "BPJS", value: 65 },
    { name: "Asuransi Swasta", value: 20 },
    { name: "Umum (Bayar Sendiri)", value: 15 },
  ]

  // Data untuk grafik tren rujukan
  const referralData = [
    { name: "Jan", "Rujukan Keluar": 85, "Rujukan Masuk": 45 },
    { name: "Feb", "Rujukan Keluar": 90, "Rujukan Masuk": 50 },
    { name: "Mar", "Rujukan Keluar": 95, "Rujukan Masuk": 55 },
    { name: "Apr", "Rujukan Keluar": 100, "Rujukan Masuk": 60 },
  ]

  // Data untuk grafik analisis biaya
  const costAnalysisData = [
    { name: "Jan", Pendapatan: 1200000000, "Biaya Operasional": 800000000, Keuntungan: 400000000 },
    { name: "Feb", Pendapatan: 1250000000, "Biaya Operasional": 820000000, Keuntungan: 430000000 },
    { name: "Mar", Pendapatan: 1300000000, "Biaya Operasional": 850000000, Keuntungan: 450000000 },
    { name: "Apr", Pendapatan: 1350000000, "Biaya Operasional": 870000000, Keuntungan: 480000000 },
  ]

  // Data untuk grafik distribusi biaya operasional
  const operationalCostData = [
    { name: "Gaji Karyawan", value: 45 },
    { name: "Obat & Alat Medis", value: 25 },
    { name: "Utilitas", value: 10 },
    { name: "Pemeliharaan", value: 8 },
    { name: "Administrasi", value: 7 },
    { name: "Lainnya", value: 5 },
  ]

  // Warna untuk grafik
  const COLORS = ["#3FB6F6", "#34D399", "#F59E0B", "#EC4899", "#8B5CF6", "#6B7280"]
  const GENDER_COLORS = { Laki: "#3FB6F6", Perempuan: "#34D399" }
  const COST_COLORS = {
    Pendapatan: "#34D399",
    "Biaya Operasional": "#3FB6F6",
    Keuntungan: "#8B5CF6",
  }

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800 border-green-200"
      case "Cuti":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Nonaktif":
        return "bg-red-100 text-red-800 border-red-200"
      case "Normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Tinggi":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Overload":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fungsi untuk mendapatkan warna prioritas
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Tinggi":
        return "bg-red-100 text-red-800 border-red-200"
      case "Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Rendah":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fungsi untuk mendapatkan warna tipe insight
  const getInsightColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "alert":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // Fungsi untuk menangani klik pada insight
  const handleInsightClick = (insight) => {
    setSelectedInsight(insight)
    setShowInsightDetail(true)
  }

  // Fungsi untuk menangani submit form pengumuman
  const handleAnnouncementSubmit = (e) => {
    e.preventDefault()
    // Logika untuk menyimpan pengumuman
    setShowAnnouncementForm(false)
  }

  // Fungsi untuk format angka dengan pemisah ribuan
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Fungsi untuk format angka ke dalam format rupiah
  const formatRupiah = (num) => {
    return `Rp ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Direktur</h1>
          <p className="mt-2 text-gray-600">Pantau performa layanan dan ambil keputusan berbasis data</p>
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
                <span className="font-medium">Laporan Bulanan Tersedia</span>
                <span className="text-xs text-muted-foreground">Hari ini, 08:15 WIB</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Performa Dokter Diperbarui</span>
                <span className="text-xs text-muted-foreground">Kemarin, 14:30 WIB</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Tren Penyakit Baru Terdeteksi</span>
                <span className="text-xs text-muted-foreground">2 hari lalu, 10:45 WIB</span>
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
          <AlertTitle className="text-blue-800">Laporan Bulanan Tersedia</AlertTitle>
          <AlertDescription className="text-blue-700">
            Laporan statistik bulan April 2025 telah tersedia. Silakan unduh atau lihat detail untuk informasi lebih
            lanjut.
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

      {/* Ringkasan Statistik Utama */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pasien Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{formatNumber(statsData.totalPatients)}</div>
              <div className="flex flex-col items-end">
                <Badge className="bg-green-100 text-green-800 border-green-200">{statsData.patientGrowth}</Badge>
                <span className="text-xs text-gray-500 mt-1">vs bulan lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kunjungan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{formatNumber(statsData.totalVisitsThisMonth)}</div>
              <div className="flex flex-col items-end">
                <Badge className="bg-green-100 text-green-800 border-green-200">{statsData.visitGrowth}</Badge>
                <span className="text-xs text-gray-500 mt-1">vs bulan lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dokter Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.activeDoctors}</div>
              <div className="flex flex-col items-end">
                <Badge className="bg-green-100 text-green-800 border-green-200">{statsData.doctorGrowth}</Badge>
                <span className="text-xs text-gray-500 mt-1">vs bulan lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fasilitas Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{statsData.activeFacilities}</div>
              <div className="flex flex-col items-end">
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">{statsData.facilityGrowth}</Badge>
                <span className="text-xs text-gray-500 mt-1">vs bulan lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs untuk konten utama */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ikhtisar Umum
          </TabsTrigger>
          <TabsTrigger value="patients">
            <Users className="h-4 w-4 mr-2" />
            Statistik Pasien
          </TabsTrigger>
          <TabsTrigger value="medical">
            <Activity className="h-4 w-4 mr-2" />
            Data Medis
          </TabsTrigger>
          <TabsTrigger value="financial">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analisis Keuangan
          </TabsTrigger>
          <TabsTrigger value="facilities">
            <Building className="h-4 w-4 mr-2" />
            Fasilitas & SDM
          </TabsTrigger>
        </TabsList>

        {/* Tab Ikhtisar Umum */}
        <TabsContent value="overview" className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select defaultValue="bulan" onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Hari Ini</SelectItem>
                  <SelectItem value="minggu">Minggu Ini</SelectItem>
                  <SelectItem value="bulan">Bulan Ini</SelectItem>
                  <SelectItem value="tahun">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter Lanjutan</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Unduh Laporan</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <FilePdf className="mr-2 h-4 w-4" />
                    <span>Unduh PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Unduh Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Printer className="mr-2 h-4 w-4" />
                    <span>Cetak Laporan</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Perbarui Data</span>
              </Button>
            </div>
          </div>

          {/* Grafik & Statistik */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grafik Tren Kunjungan Tahunan */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <LineChartIcon className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Tren Kunjungan Tahunan</CardTitle>
                    </div>
                    <CardDescription>Jumlah kunjungan pasien per bulan dalam tahun 2025</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyVisitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${formatNumber(value)} Kunjungan`, "Jumlah"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="kunjungan"
                        name="Jumlah Kunjungan"
                        stroke="#3FB6F6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Perbandingan Tahun Ini vs Tahun Lalu */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Perbandingan Kunjungan Tahunan</CardTitle>
                    </div>
                    <CardDescription>Perbandingan kunjungan tahun 2025 vs 2024</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${formatNumber(value)} Kunjungan`, ""]} />
                      <Legend />
                      <Bar dataKey="Tahun 2025" fill="#3FB6F6" name="Tahun 2025" />
                      <Bar dataKey="Tahun 2024" fill="#34D399" name="Tahun 2024" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Tren Penyakit Terbanyak */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Tren Penyakit Terbanyak</CardTitle>
                    </div>
                    <CardDescription>Distribusi penyakit yang paling sering didiagnosis</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                      <Pie
                        data={diseaseData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChartRecharts>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Kepadatan Pelayanan */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <LineChartIcon className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Kepadatan Pelayanan</CardTitle>
                    </div>
                    <CardDescription>Jumlah kunjungan harian dalam sebulan terakhir</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Kunjungan`, "Jumlah"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="kunjungan"
                        name="Jumlah Kunjungan"
                        stroke="#3FB6F6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifikasi & Insight */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notifikasi & Insight</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Lihat Semua</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {insightsData.slice(0, 3).map((insight) => (
                <Card
                  key={insight.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleInsightClick(insight)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={getInsightColor(insight.tipe)}>
                        {insight.tipe === "success"
                          ? "Positif"
                          : insight.tipe === "warning"
                            ? "Perhatian"
                            : "Peringatan"}
                      </Badge>
                      <span className="text-xs text-gray-500">{insight.tanggal}</span>
                    </div>
                    <CardTitle className="text-lg mt-2">{insight.judul}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{insight.deskripsi}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="ml-auto text-[#3FB6F6]">
                      <span>Lihat Detail</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Dialog Detail Insight */}
            <Dialog open={showInsightDetail} onOpenChange={setShowInsightDetail}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedInsight?.judul}</DialogTitle>
                  <DialogDescription>
                    <div className="flex justify-between items-center mt-1">
                      <Badge className={selectedInsight && getInsightColor(selectedInsight.tipe)}>
                        {selectedInsight?.tipe === "success"
                          ? "Positif"
                          : selectedInsight?.tipe === "warning"
                            ? "Perhatian"
                            : "Peringatan"}
                      </Badge>
                      <span className="text-sm text-gray-500">{selectedInsight?.tanggal}</span>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p>{selectedInsight?.detail}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Tandai Sudah Dibaca</Button>
                  <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                    Ambil Tindakan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pengumuman Internal */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pengumuman Internal</h2>
              <Button
                className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                onClick={() => setShowAnnouncementForm(true)}
              >
                <Megaphone className="mr-2 h-4 w-4" />
                <span>Buat Pengumuman</span>
              </Button>
            </div>

            <div className="space-y-4">
              {announcementsData.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{announcement.judul}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(announcement.prioritas)}>{announcement.prioritas}</Badge>
                          <span className="text-sm text-gray-500">Untuk: {announcement.penerima}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{announcement.tanggal}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{announcement.deskripsi}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Kirim Ulang</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Dialog Form Pengumuman */}
            <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                  <DialogDescription>
                    Buat pengumuman untuk disebarkan kepada staf dan dokter di fasilitas kesehatan
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="judul">Judul Pengumuman</Label>
                      <Input id="judul" placeholder="Masukkan judul pengumuman" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Isi Pengumuman</Label>
                      <Textarea id="deskripsi" placeholder="Masukkan isi pengumuman" rows={5} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="penerima">Penerima</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="penerima">
                            <SelectValue placeholder="Pilih penerima" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Staf</SelectItem>
                            <SelectItem value="doctors">Dokter</SelectItem>
                            <SelectItem value="nurses">Perawat</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="heads">Kepala Departemen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prioritas">Prioritas</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="prioritas">
                            <SelectValue placeholder="Pilih prioritas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Tinggi</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="low">Rendah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAnnouncementForm(false)}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      <span>Kirim Pengumuman</span>
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabel Data Manajerial */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Data Manajerial</h2>

            <Tabs defaultValue="doctors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="doctors">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Dokter Aktif
                </TabsTrigger>
                <TabsTrigger value="poli">
                  <HospitalIcon className="h-4 w-4 mr-2" />
                  Jumlah Pasien Tiap Poli
                </TabsTrigger>
                <TabsTrigger value="activities">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Rangkuman Kegiatan Medis
                </TabsTrigger>
              </TabsList>

              {/* Tab Dokter Aktif */}
              <TabsContent value="doctors" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Cari dokter..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Dokter</TableHead>
                          <TableHead>Spesialisasi</TableHead>
                          <TableHead>Poli</TableHead>
                          <TableHead>Jadwal Praktik</TableHead>
                          <TableHead>Pasien Bulanan</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeDoctorsData.map((doctor) => (
                          <TableRow key={doctor.id}>
                            <TableCell className="font-medium">{doctor.nama}</TableCell>
                            <TableCell>{doctor.spesialisasi}</TableCell>
                            <TableCell>{doctor.poli}</TableCell>
                            <TableCell>{doctor.jadwal}</TableCell>
                            <TableCell>{doctor.pasienBulanan}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(doctor.status)}>{doctor.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Jumlah Pasien Tiap Poli */}
              <TabsContent value="poli" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Cari poli..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Poli</TableHead>
                          <TableHead>Pasien Harian</TableHead>
                          <TableHead>Pasien Bulanan</TableHead>
                          <TableHead>Jumlah Dokter</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poliPatientsData.map((poli) => (
                          <TableRow key={poli.id}>
                            <TableCell className="font-medium">{poli.poli}</TableCell>
                            <TableCell>{poli.pasienHarian}</TableCell>
                            <TableCell>{poli.pasienBulanan}</TableCell>
                            <TableCell>{poli.dokter}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(poli.status)}>{poli.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Rangkuman Kegiatan Medis */}
              <TabsContent value="activities" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Cari periode..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Periode</TableHead>
                          <TableHead>Jumlah Kunjungan</TableHead>
                          <TableHead>Tindakan Medis</TableHead>
                          <TableHead>Rujukan</TableHead>
                          <TableHead>Resep Obat</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicalActivitiesData.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.tanggal}</TableCell>
                            <TableCell>{activity.kunjungan}</TableCell>
                            <TableCell>{activity.tindakanMedis}</TableCell>
                            <TableCell>{activity.rujukan}</TableCell>
                            <TableCell>{activity.resepObat}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        {/* Tab Statistik Pasien */}
        <TabsContent value="patients" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Statistik Pasien</h2>
            <div className="flex gap-2">
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Harian</SelectItem>
                  <SelectItem value="minggu">Mingguan</SelectItem>
                  <SelectItem value="bulan">Bulanan</SelectItem>
                  <SelectItem value="tahun">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grafik Statistik Pasien Berdasarkan Usia & Jenis Kelamin */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Pasien Berdasarkan Usia & Jenis Kelamin</CardTitle>
                    </div>
                    <CardDescription>Distribusi pasien berdasarkan kelompok usia dan jenis kelamin</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGenderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Pasien`, ""]} />
                      <Legend />
                      <Bar dataKey="Laki" fill={GENDER_COLORS.Laki} name="Laki-laki" />
                      <Bar dataKey="Perempuan" fill={GENDER_COLORS.Perempuan} name="Perempuan" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Distribusi Pasien Berdasarkan Asuransi */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Distribusi Pasien Berdasarkan Asuransi</CardTitle>
                    </div>
                    <CardDescription>Persentase pasien berdasarkan jenis asuransi</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                      <Pie
                        data={insuranceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {insuranceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChartRecharts>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Kepuasan Pasien */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <LineChartIcon className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Tingkat Kepuasan Pasien</CardTitle>
                    </div>
                    <CardDescription>Persentase kepuasan pasien per bulan</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientSatisfactionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Kepuasan"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="kepuasan"
                        name="Tingkat Kepuasan"
                        stroke="#34D399"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Waktu Tunggu Pasien */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Waktu Tunggu Pasien</CardTitle>
                    </div>
                    <CardDescription>Rata-rata waktu tunggu pasien per poli (dalam menit)</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={waitingTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value} menit`, "Waktu Tunggu"]} />
                      <Legend />
                      <Bar dataKey="waktu" name="Waktu Tunggu" fill="#3FB6F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Data Medis */}
        <TabsContent value="medical" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Data Medis</h2>
            <div className="flex gap-2">
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Harian</SelectItem>
                  <SelectItem value="minggu">Mingguan</SelectItem>
                  <SelectItem value="bulan">Bulanan</SelectItem>
                  <SelectItem value="tahun">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grafik Tren Penyakit */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Tren Penyakit</CardTitle>
                    </div>
                    <CardDescription>Distribusi penyakit yang paling sering didiagnosis</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                      <Pie
                        data={diseaseData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChartRecharts>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Distribusi Jenis Layanan */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Distribusi Jenis Layanan</CardTitle>
                    </div>
                    <CardDescription>Persentase kunjungan berdasarkan jenis layanan</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                      <Pie
                        data={serviceTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChartRecharts>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Resep Obat */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Pill className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Resep Obat</CardTitle>
                    </div>
                    <CardDescription>Jenis obat yang paling banyak diresepkan</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={medicineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Persentase"]} />
                      <Legend />
                      <Bar dataKey="value" name="Persentase" fill="#3FB6F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Tren Rujukan */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <LineChartIcon className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Tren Rujukan</CardTitle>
                    </div>
                    <CardDescription>Jumlah rujukan masuk dan keluar per bulan</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={referralData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Rujukan`, ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Rujukan Keluar"
                        stroke="#3FB6F6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Rujukan Masuk"
                        stroke="#34D399"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Analisis Keuangan */}
        <TabsContent value="financial" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analisis Keuangan</h2>
            <div className="flex gap-2">
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Harian</SelectItem>
                  <SelectItem value="minggu">Mingguan</SelectItem>
                  <SelectItem value="bulan">Bulanan</SelectItem>
                  <SelectItem value="tahun">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grafik Analisis Biaya */}
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Analisis Biaya</CardTitle>
                    </div>
                    <CardDescription>Pendapatan, biaya operasional, dan keuntungan per bulan</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={costAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${formatRupiah(value)}`, ""]} />
                      <Legend />
                      <Bar dataKey="Pendapatan" fill={COST_COLORS.Pendapatan} />
                      <Bar dataKey="Biaya Operasional" fill={COST_COLORS["Biaya Operasional"]} />
                      <Line
                        type="monotone"
                        dataKey="Keuntungan"
                        stroke={COST_COLORS.Keuntungan}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Distribusi Biaya Operasional */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Distribusi Biaya Operasional</CardTitle>
                    </div>
                    <CardDescription>Persentase biaya operasional berdasarkan kategori</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                      <Pie
                        data={operationalCostData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {operationalCostData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChartRecharts>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grafik Performa Dokter */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-[#3FB6F6]" />
                      <CardTitle>Performa Dokter</CardTitle>
                    </div>
                    <CardDescription>Jumlah pasien yang ditangani per dokter</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={doctorPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Pasien`, "Jumlah"]} />
                      <Legend />
                      <Bar dataKey="pasien" name="Jumlah Pasien" fill="#3FB6F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Fasilitas & SDM */}
        <TabsContent value="facilities" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Fasilitas & SDM</h2>
            <div className="flex gap-2">
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Harian</SelectItem>
                  <SelectItem value="minggu">Mingguan</SelectItem>
                  <SelectItem value="bulan">Bulanan</SelectItem>
                  <SelectItem value="tahun">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Fasilitas & SDM</CardTitle>
              <CardDescription>
                Halaman ini masih dalam pengembangan. Silakan kembali nanti untuk melihat informasi tentang fasilitas
                dan SDM.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-6 text-center">
                <Building className="mx-auto h-10 w-10 text-[#3FB6F6]" />
                <p className="mt-4 text-lg font-medium">Fitur Sedang Dikembangkan</p>
                <p className="mt-2 text-sm text-gray-500">
                  Tim pengembang sedang bekerja untuk menyelesaikan halaman ini. Silakan kembali nanti.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="border-t pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">&copy; 2025 HealthSync. Hak Cipta Dilindungi.</div>
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
