"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Menu,
  X,
  ArrowRight,
  Shield,
  Globe,
  Building2,
  BarChart3,
  CheckCircle,
  Star,
} from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/landing" className="flex items-center group">
              <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#3FB6F6] via-[#34D399] to-[#10B981] shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="flex h-full items-center justify-center text-xl font-bold text-white">HS</div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                HealthSync
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            <Link
              href="#about"
              className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6] transition-colors duration-200 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3FB6F6] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6] transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3FB6F6] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6] transition-colors duration-200 relative group"
            >
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3FB6F6] group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-sm font-medium hover:bg-gray-50">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-sm font-medium text-white hover:from-[#3FB6F6] hover:to-[#2ebb85] shadow-lg hover:shadow-xl transition-all duration-300 group">
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="#about" className="block text-sm font-medium text-gray-700 hover:text-[#3FB6F6] py-2">
                About
              </Link>
              <Link href="#features" className="block text-sm font-medium text-gray-700 hover:text-[#3FB6F6] py-2">
                Features
              </Link>
              <Link href="#testimonials" className="block text-sm font-medium text-gray-700 hover:text-[#3FB6F6] py-2">
                Testimonials
              </Link>
              <Link href="/login" className="block text-sm font-medium text-gray-700 hover:text-[#3FB6F6] py-2">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-6 py-20 md:py-32">
            <div className="flex flex-col items-center justify-between gap-16 lg:flex-row">
              <div className="max-w-2xl space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3FB6F6]/10 to-[#34D399]/10 px-4 py-2 text-sm font-medium text-[#3FB6F6] border border-[#3FB6F6]/20">
                  <span className="mr-2">🚀</span>
                  New: Advanced Health Analytics
                </div>

                <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                  <span className="block">Integrated</span>
                  <span className="block bg-gradient-to-r from-[#3FB6F6] to-[#34D399] bg-clip-text text-transparent">
                    Digital Medical
                  </span>
                  <span className="block">Records</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  One secure account to access your complete medical history across all healthcare facilities.
                  Experience the future of healthcare management.
                </p>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85] shadow-xl hover:shadow-2xl transition-all duration-300 group sm:w-auto px-8 py-4 text-lg"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-4 text-lg border-2 hover:bg-gray-50"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center space-x-8 pt-8">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">256-bit Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-2xl lg:max-w-xl">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#3FB6F6] to-[#34D399] rounded-3xl blur-2xl opacity-20"></div>
                  <Image
                    src="/illustrations/hero.jpg"
                    alt="HealthSync - Digital Medical Records Platform"
                    width={600}
                    height={500}
                    className="relative h-auto w-full rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-20 text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3FB6F6]/10 to-[#34D399]/10 px-4 py-2 text-sm font-medium text-[#3FB6F6] border border-[#3FB6F6]/20 mb-6">
                Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose HealthSync?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the advantages of our comprehensive digital medical records system designed for modern
                healthcare
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="group text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB6F6]/20 to-[#34D399]/20 group-hover:from-[#3FB6F6]/30 group-hover:to-[#34D399]/30 transition-all duration-300 group-hover:scale-110">
                    <Shield className="h-10 w-10 text-[#3FB6F6]" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Secure & Protected</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your medical data is encrypted with military-grade security and protected with the highest industry
                  standards
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB6F6]/20 to-[#34D399]/20 group-hover:from-[#3FB6F6]/30 group-hover:to-[#34D399]/30 transition-all duration-300 group-hover:scale-110">
                    <Globe className="h-10 w-10 text-[#3FB6F6]" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Access Anywhere</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your complete medical records anytime, anywhere, from any device with our cloud-based platform
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB6F6]/20 to-[#34D399]/20 group-hover:from-[#3FB6F6]/30 group-hover:to-[#34D399]/30 transition-all duration-300 group-hover:scale-110">
                    <Building2 className="h-10 w-10 text-[#3FB6F6]" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Connected Facilities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seamlessly integrated medical records across all connected healthcare facilities and providers
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB6F6]/20 to-[#34D399]/20 group-hover:from-[#3FB6F6]/30 group-hover:to-[#34D399]/30 transition-all duration-300 group-hover:scale-110">
                    <BarChart3 className="h-10 w-10 text-[#3FB6F6]" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your health progress with AI-powered insights and easy-to-understand data visualizations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced About Section */}
        <section id="about" className="bg-gradient-to-br from-gray-50 to-blue-50 py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-16 lg:flex-row">
              <div className="w-full max-w-2xl lg:max-w-xl">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#3FB6F6] to-[#34D399] rounded-3xl blur-2xl opacity-20"></div>
                  <Image
                    src="/illustrations/about-us.png"
                    alt="About HealthSync - Connecting Healthcare"
                    width={600}
                    height={500}
                    className="relative h-auto w-full rounded-2xl"
                  />
                </div>
              </div>

              <div className="max-w-2xl space-y-8">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3FB6F6]/10 to-[#34D399]/10 px-4 py-2 text-sm font-medium text-[#3FB6F6] border border-[#3FB6F6]/20">
                  About Us
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Revolutionizing Healthcare Management</h2>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    HealthSync is an integrated digital medical records platform that connects patients, doctors, and
                    healthcare facilities in one secure and efficient ecosystem.
                  </p>
                  <p>
                    Our mission is to simplify access to healthcare services and ensure everyone has full control over
                    their health data, making healthcare more accessible, efficient, and patient-centered.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <div className="text-3xl font-bold text-[#3FB6F6] mb-2">10K+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#3FB6F6] mb-2">500+</div>
                    <div className="text-gray-600">Healthcare Facilities</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#3FB6F6] mb-2">99.9%</div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#3FB6F6] mb-2">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>

                <div>
                  <Link href="#features">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85] shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-4"
                    >
                      Explore Our Features
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section id="testimonials" className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-20 text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3FB6F6]/10 to-[#34D399]/10 px-4 py-2 text-sm font-medium text-[#3FB6F6] border border-[#3FB6F6]/20 mb-6">
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trusted by Healthcare Professionals</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                See what our users say about their experience with HealthSync
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "HealthSync has transformed how I access patient medical history. The speed and accuracy have
                    greatly improved my ability to provide better care and make more informed diagnoses."
                  </p>
                  <div className="flex items-center">
                    <div className="mr-4 h-14 w-14 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">DR</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. Sarah Wilson</h4>
                      <p className="text-sm text-gray-600">Pediatric Specialist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "Finally, no more carrying physical files! HealthSync keeps all my health data organized and easily
                    accessible. It's made managing my healthcare so much simpler."
                  </p>
                  <div className="flex items-center">
                    <div className="mr-4 h-14 w-14 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">JS</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">John Smith</h4>
                      <p className="text-sm text-gray-600">Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "Implementing HealthSync has significantly improved our operational efficiency and patient
                    satisfaction. This system has truly transformed how we manage health data."
                  </p>
                  <div className="flex items-center">
                    <div className="mr-4 h-14 w-14 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">MD</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Maria Davis</h4>
                      <p className="text-sm text-gray-600">Hospital Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#3FB6F6] via-[#34D399] to-[#10B981] py-24 md:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-4xl md:text-6xl font-bold text-white leading-tight">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="mb-12 text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of patients and healthcare providers who trust HealthSync for their digital medical
                records
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full bg-white px-12 py-6 text-xl font-bold text-[#3FB6F6] hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <div className="text-white/80 text-sm">No credit card required • Free forever plan available</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="mr-3 h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-[#3FB6F6] to-[#34D399]">
                  <div className="flex h-full items-center justify-center text-xl font-bold text-white">HS</div>
                </div>
                <span className="text-2xl font-bold">HealthSync</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Revolutionizing healthcare management with secure, integrated digital medical records. Connecting
                patients, doctors, and facilities for better health outcomes.
              </p>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                  <Facebook size={24} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                  <Twitter size={24} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                  <Instagram size={24} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#3FB6F6] transition-colors duration-200">
                  <Mail size={24} />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 HealthSync. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
