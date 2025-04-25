"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Perbarui fungsi handleSubmit untuk mengarahkan pengguna berdasarkan domain email

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email dan kata sandi harus diisi")
      return
    }

    setIsLoading(true)

    try {
      // Simulasi proses login
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Routing berdasarkan domain email
      if (email.endsWith("@pasien.com")) {
        router.push("/dashboard")
      } else if (email.endsWith("@dokter.com")) {
        router.push("/dashboard-dokter")
      } else if (email.endsWith("@admin.com")) {
        router.push("/dashboard-admin")
      } else if (email.endsWith("@direktur.com")) {
        router.push("/dashboard-direktur")
      } else {
        // Default ke dashboard pasien
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Masuk ke HealthSync</h1>
        <p className="text-sm text-gray-500">Masukkan kredensial Anda untuk mengakses sistem HealthSync</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Kata Sandi</Label>
              <Link href="/reset-password" className="text-xs font-medium text-[#3FB6F6] hover:text-[#34D399]">
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Ingat saya
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-[#3FB6F6] hover:text-[#34D399]">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
