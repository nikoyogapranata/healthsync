import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/landing" className="flex items-center">
              <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                <div className="flex h-full items-center justify-center text-lg font-bold text-white">HS</div>
              </div>
              <span className="text-xl font-bold text-gray-900">HealthSync</span>
            </Link>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#tentang" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              Tentang
            </Link>
            <Link href="#fitur" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              Fitur
            </Link>
            <Link href="#testimoni" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              Testimoni
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-sm font-medium text-white hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
              <div className="max-w-xl space-y-6 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  Rekam Medis Digital Terintegrasi
                </h1>
                <p className="text-xl text-gray-600">
                  Satu akun, akses riwayat medis Anda di seluruh fasilitas kesehatan
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85] sm:w-auto">
                      Coba Sekarang
                    </Button>
                  </Link>
                  <Link href="#fitur">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-md">
                <Image
                  src="/illustrations/hero-illustration.svg"
                  alt="Ilustrasi HealthSync"
                  width={500}
                  height={400}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Fitur Unggulan */}
        <section id="fitur" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Fitur Unggulan</h2>
              <p className="mt-4 text-lg text-gray-600">
                Nikmati berbagai keunggulan sistem rekam medis digital HealthSync
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Fitur 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Aman dan Terlindungi</h3>
                <p className="text-gray-600">
                  Data medis Anda dienkripsi dan dilindungi dengan standar keamanan tertinggi
                </p>
              </div>

              {/* Fitur 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Akses di Mana Saja</h3>
                <p className="text-gray-600">
                  Akses rekam medis Anda kapan saja dan di mana saja melalui perangkat apa pun
                </p>
              </div>

              {/* Fitur 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Terhubung antar Fasilitas</h3>
                <p className="text-gray-600">
                  Rekam medis terintegrasi di seluruh jaringan fasilitas kesehatan yang terhubung
                </p>
              </div>

              {/* Fitur 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Statistik Kesehatan Real-Time</h3>
                <p className="text-gray-600">
                  Pantau perkembangan kesehatan Anda dengan visualisasi data yang mudah dipahami
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tentang */}
        <section id="tentang" className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
              <div className="w-full max-w-md">
                <Image
                  src="/illustrations/about-illustration.svg"
                  alt="Tentang HealthSync"
                  width={500}
                  height={400}
                  className="h-auto w-full"
                />
              </div>
              <div className="max-w-xl space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Tentang HealthSync</h2>
                <p className="text-lg text-gray-600">
                  HealthSync adalah platform rekam medis digital terintegrasi yang menghubungkan pasien, dokter, dan
                  fasilitas kesehatan dalam satu ekosistem yang aman dan efisien.
                </p>
                <p className="text-lg text-gray-600">
                  Misi kami adalah menyederhanakan akses terhadap layanan kesehatan dan memastikan setiap orang memiliki
                  kendali penuh atas data kesehatan mereka.
                </p>
                <div>
                  <Link href="#fitur">
                    <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                      Pelajari Fitur Kami
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoni */}
        <section id="testimoni" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Testimoni Pengguna</h2>
              <p className="mt-4 text-lg text-gray-600">
                Lihat apa kata pengguna kami tentang pengalaman mereka dengan HealthSync
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Testimoni 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">DR</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. Rina Wijaya</h4>
                      <p className="text-sm text-gray-600">Dokter Spesialis Anak</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "HealthSync memudahkan saya untuk mengakses riwayat medis pasien dengan cepat. Ini sangat membantu
                    dalam memberikan diagnosis yang lebih akurat dan perawatan yang lebih baik."
                  </p>
                </CardContent>
              </Card>

              {/* Testimoni 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">BS</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Budi Santoso</h4>
                      <p className="text-sm text-gray-600">Pasien</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "Saya tidak perlu lagi membawa berkas rekam medis fisik saat berobat. Semua data kesehatan saya
                    tersimpan dengan rapi dan dapat diakses dengan mudah melalui HealthSync."
                  </p>
                </CardContent>
              </Card>

              {/* Testimoni 3 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">SD</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Siti Dewi</h4>
                      <p className="text-sm text-gray-600">Direktur Rumah Sakit</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "Implementasi HealthSync di rumah sakit kami telah meningkatkan efisiensi operasional dan kepuasan
                    pasien secara signifikan. Sistem ini benar-benar mengubah cara kami mengelola data kesehatan."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Penutup */}
        <section className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Bergabunglah sekarang dan rasakan kemudahan akses layanan kesehatan digital
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Mulai perjalanan menuju kesehatan yang lebih baik dengan HealthSync
              </p>
              <Link href="/register">
                <Button className="rounded-full bg-white px-8 py-6 text-lg font-bold text-[#3FB6F6] hover:bg-gray-100">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                <div className="flex h-full items-center justify-center text-lg font-bold text-white">HS</div>
              </div>
              <span className="text-xl font-bold text-gray-900">HealthSync</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                Kontak
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                FAQ
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                Kebijakan Privasi
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-[#3FB6F6]">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#3FB6F6]">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#3FB6F6]">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#3FB6F6]">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#3FB6F6]">
                <Phone size={20} />
                <span className="sr-only">Phone</span>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">© 2025 HealthSync. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
