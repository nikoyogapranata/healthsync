import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Bagian Kiri - Ilustrasi */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gray-100 p-8 md:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3FB6F6]/20 to-[#34D399]/20" />
        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <div className="mb-8 w-full max-w-sm">
            <Image
              src="/illustrations/doctor-patient.svg"
              alt="Ilustrasi Dokter dan Pasien"
              width={400}
              height={400}
              className="h-auto w-full"
              priority
            />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">HealthSync</h2>
          <p className="text-lg font-medium text-gray-700">"Kesehatan Anda, Data Anda, Kendali di Tangan Anda."</p>
        </div>
      </div>

      {/* Bagian Kanan - Form Login */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
