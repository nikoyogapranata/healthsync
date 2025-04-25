"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    password: "",
    confirmPassword: "",
    tanggalLahir: "",
    nik: "",
    nomorHP: "",
    alamat: "",
    role: "",
    fasilitasKesehatan: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user selects
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Validate name
    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap harus diisi"
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Kata sandi harus diisi"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter"
      isValid = false
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok"
      isValid = false
    }

    // Validate birth date
    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = "Tanggal lahir harus diisi"
      isValid = false
    }

    // Validate NIK
    if (!formData.nik.trim()) {
      newErrors.nik = "NIK harus diisi"
      isValid = false
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus terdiri dari 16 digit angka"
      isValid = false
    }

    // Validate phone number
    if (!formData.nomorHP.trim()) {
      newErrors.nomorHP = "Nomor HP harus diisi"
      isValid = false
    } else if (!/^[0-9]{10,13}$/.test(formData.nomorHP)) {
      newErrors.nomorHP = "Nomor HP tidak valid"
      isValid = false
    }

    // Validate address
    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat harus diisi"
      isValid = false
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = "Role harus dipilih"
      isValid = false
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat & ketentuan"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulasi proses registrasi
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect ke halaman login setelah berhasil registrasi
      router.push("/login?registered=true")
    } catch (err) {
      setErrors({
        ...errors,
        general: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Data fasilitas kesehatan (contoh)
  const fasilitasKesehatanOptions = [
    { value: "rs-healthsync", label: "RS HealthSync" },
    { value: "puskesmas-sejahtera", label: "Puskesmas Sejahtera" },
    { value: "klinik-bahagia", label: "Klinik Bahagia" },
    { value: "rs-sehat-sentosa", label: "RS Sehat Sentosa" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Akun HealthSync</h1>
        <p className="text-sm text-gray-500">Lengkapi data diri Anda untuk membuat akun di sistem HealthSync</p>
      </div>

      {errors.general && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <Input
              id="namaLengkap"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className={errors.namaLengkap ? "border-red-500" : ""}
            />
            {errors.namaLengkap && <p className="text-xs text-red-500">{errors.namaLengkap}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@contoh.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? "border-red-500" : ""}
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
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                <span className="sr-only">
                  {showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                </span>
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input
              id="tanggalLahir"
              name="tanggalLahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className={errors.tanggalLahir ? "border-red-500" : ""}
            />
            {errors.tanggalLahir && <p className="text-xs text-red-500">{errors.tanggalLahir}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nik">Nomor Identitas (KTP/NIK)</Label>
            <Input
              id="nik"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="Masukkan 16 digit NIK"
              className={errors.nik ? "border-red-500" : ""}
            />
            {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorHP">Nomor HP</Label>
            <Input
              id="nomorHP"
              name="nomorHP"
              value={formData.nomorHP}
              onChange={handleChange}
              placeholder="Masukkan nomor HP"
              className={errors.nomorHP ? "border-red-500" : ""}
            />
            {errors.nomorHP && <p className="text-xs text-red-500">{errors.nomorHP}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Pilih Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
              <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pasien">Pasien</SelectItem>
                <SelectItem value="dokter">Dokter</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="direktur">Direktur</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
          </div>

          {(formData.role === "dokter" || formData.role === "admin" || formData.role === "direktur") && (
            <div className="space-y-2">
              <Label htmlFor="fasilitasKesehatan">Fasilitas Kesehatan</Label>
              <Select
                value={formData.fasilitasKesehatan}
                onValueChange={(value) => handleSelectChange("fasilitasKesehatan", value)}
              >
                <SelectTrigger id="fasilitasKesehatan">
                  <SelectValue placeholder="Pilih fasilitas kesehatan" />
                </SelectTrigger>
                <SelectContent>
                  {fasilitasKesehatanOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap"
            className={errors.alamat ? "border-red-500" : ""}
            rows={3}
          />
          {errors.alamat && <p className="text-xs text-red-500">{errors.alamat}</p>}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className={errors.agreeToTerms ? "border-red-500" : ""}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="terms" className={`text-sm font-normal ${errors.agreeToTerms ? "text-red-500" : ""}`}>
              Saya menyetujui syarat & ketentuan HealthSync
            </Label>
            {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-[#3FB6F6] hover:text-[#34D399]">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
