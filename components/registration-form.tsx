"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail } from "lucide-react"
import { registerPatient } from "@/app/actions/patient-registration"
import { createClient } from "@/utils/supabase/client"

// --- Interfaces for location data ---
interface Province {
  province_id: number
  name: string
}
interface Regency {
  regency_id: number
  name: string
}
interface District {
  district_id: number
  name: string
}

export function RegistrationForm() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    national_id: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    province_id: "",
    regency_id: "",
    district_id: "",
    street_address: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  // --- State for address dropdowns ---
  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [isProvincesLoading, setIsProvincesLoading] = useState(true)
  const [isRegenciesLoading, setIsRegenciesLoading] = useState(false)
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false)

  // --- Fetch initial provinces ---
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsProvincesLoading(true)
      const { data, error } = await supabase.from("provinces").select("*").order("name")
      if (data) {
        setProvinces(data)
      } else {
        console.error("Error fetching provinces:", error)
      }
      setIsProvincesLoading(false)
    }
    fetchProvinces()
  }, [supabase])

  // --- Fetch regencies when province changes ---
  useEffect(() => {
    const fetchRegencies = async () => {
      if (!formData.province_id) return
      setIsRegenciesLoading(true)
      setRegencies([])
      setDistricts([])
      setFormData((prev) => ({ ...prev, regency_id: "", district_id: "" }))

      const { data, error } = await supabase
        .from("regencies")
        .select("*")
        .eq("province_id", formData.province_id)
        .order("name")

      if (data) {
        setRegencies(data)
      } else {
        console.error("Error fetching regencies:", error)
      }
      setIsRegenciesLoading(false)
    }
    fetchRegencies()
  }, [formData.province_id, supabase])

  // --- Fetch districts when regency changes ---
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.regency_id) return
      setIsDistrictsLoading(true)
      setDistricts([])
      setFormData((prev) => ({ ...prev, district_id: "" }))

      const { data, error } = await supabase
        .from("districts")
        .select("*")
        .eq("regency_id", formData.regency_id)
        .order("name")

      if (data) {
        setDistricts(data)
      } else {
        console.error("Error fetching districts:", error)
      }
      setIsDistrictsLoading(false)
    }
    fetchDistricts()
  }, [formData.regency_id, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // --- Start Validation ---
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      setIsLoading(false)
      return
    }

    if (!formData.national_id.trim()) {
      setError("National ID is required")
      setIsLoading(false)
      return
    }

    if (formData.national_id.length !== 16 || !/^\d+$/.test(formData.national_id)) {
      setError("National ID must be 16 digits and contain only numbers.")
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    if (!formData.password) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    // --- End Validation ---

    try {
      console.log("Submitting registration via server action...")

      const result = await registerPatient({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        national_id: formData.national_id,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodType: formData.bloodType,
        province_id: formData.province_id,
        regency_id: formData.regency_id,
        district_id: formData.district_id,
        street_address: formData.street_address,
      })

      if (!result.success) {
        setError(result.message)
        return
      }

      console.log("Registration successful!")
      setSuccess(result.message)
      setShowVerificationMessage(true)

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        national_id: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        province_id: "",
        regency_id: "",
        district_id: "",
        street_address: "",
      })
    } catch (err: any) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (showVerificationMessage) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>We've sent you a verification link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription className="text-center">{success}</AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Please check your email inbox and click the verification link to activate your account.
            </p>
            <p className="text-xs text-gray-500">Don't see the email? Check your spam folder or contact support.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowVerificationMessage(false)}>
              Register Another Account
            </Button>
            <Button className="flex-1" onClick={() => router.push("/login")}>
              Go to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>Create your account to access our healthcare services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- Row 1: Name and National ID --- */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="national_id">National ID (NIK)</Label>
              <Input
                id="national_id"
                name="national_id"
                value={formData.national_id}
                onChange={handleChange}
                placeholder="16-digit National ID"
                maxLength={16}
              />
            </div>

            {/* --- Row 2: Email and Phone --- */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+62 812 3456 7890"
              />
            </div>

            {/* --- Row 3: Passwords --- */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* --- Row 4: DOB and Gender --- */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Row 5: Blood Type --- */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select onValueChange={(value) => handleSelectChange("bloodType", value)} value={formData.bloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="unknown">I don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Section for Address --- */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-semibold">Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Province Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="province_id">Province</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("province_id", value)}
                  value={formData.province_id}
                  disabled={isProvincesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isProvincesLoading ? "Loading..." : "Select Province"} />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.province_id} value={String(province.province_id)}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Regency Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="regency_id">Regency / City</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("regency_id", value)}
                  value={formData.regency_id}
                  disabled={isRegenciesLoading || !formData.province_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRegenciesLoading ? "Loading..." : "Select Regency"} />
                  </SelectTrigger>
                  <SelectContent>
                    {regencies.map((regency) => (
                      <SelectItem key={regency.regency_id} value={String(regency.regency_id)}>
                        {regency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="district_id">District</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("district_id", value)}
                  value={formData.district_id}
                  disabled={isDistrictsLoading || !formData.regency_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isDistrictsLoading ? "Loading..." : "Select District"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.district_id} value={String(district.district_id)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Street Address Input */}
            <div className="space-y-2">
              <Label htmlFor="street_address">Street Address</Label>
              <Textarea
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="e.g., Jl. Merdeka No. 123, RT 01/RW 02 (optional)"
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => router.push("/login")}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
