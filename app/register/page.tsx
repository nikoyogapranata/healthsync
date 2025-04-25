import { RegisterForm } from "@/components/register-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Bagian Kiri - Ilustrasi */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 md:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#34D399]/10 to-[#3FB6F6]/10" />
        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <div className="mb-8 w-full max-w-sm">
            <Image
              src="/illustrations/doctor-system.svg"
              alt="Ilustrasi Dokter dan Sistem Komputer"
              width={400}
              height={400}
              className="h-auto w-full"
              priority
            />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">HealthSync</h2>
          <p className="text-lg font-medium text-gray-700">
            "Daftar dan kelola data kesehatan Anda dengan mudah dan aman."
          </p>
        </div>
      </div>

      {/* Bagian Kanan - Form Registrasi */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
        <div className="w-full max-w-2xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
