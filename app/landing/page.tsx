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
            <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              About
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-[#3FB6F6]">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-sm font-medium text-white hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                Sign Up
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
                  Integrated Digital Medical Records
                </h1>
                <p className="text-xl text-gray-600">
                  One account, access your medical history across all healthcare facilities
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85] sm:w-auto">
                      Try Now
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-md">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="HealthSync Illustration"
                  width={500}
                  height={400}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Benefits */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
              <p className="mt-4 text-lg text-gray-600">
                Experience the advantages of HealthSync's digital medical records system
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Secure & Protected</h3>
                <p className="text-gray-600">
                  Your medical data is encrypted and protected with the highest security standards
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Access Anywhere</h3>
                <p className="text-gray-600">Access your medical records anytime, anywhere, from any device</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Connected Facilities</h3>
                <p className="text-gray-600">Integrated medical records across all connected healthcare facilities</p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Real-Time Health Statistics</h3>
                <p className="text-gray-600">
                  Monitor your health progress with easy-to-understand data visualizations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
              <div className="w-full max-w-md">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="About HealthSync"
                  width={500}
                  height={400}
                  className="h-auto w-full"
                />
              </div>
              <div className="max-w-xl space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">About HealthSync</h2>
                <p className="text-lg text-gray-600">
                  HealthSync is an integrated digital medical records platform that connects patients, doctors, and
                  healthcare facilities in one secure and efficient ecosystem.
                </p>
                <p className="text-lg text-gray-600">
                  Our mission is to simplify access to healthcare services and ensure everyone has full control over
                  their health data.
                </p>
                <div>
                  <Link href="#features">
                    <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] text-white hover:from-[#3FB6F6] hover:to-[#2ebb85]">
                      Explore Our Features
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">User Testimonials</h2>
              <p className="mt-4 text-lg text-gray-600">
                See what our users say about their experience with HealthSync
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">DR</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. Sarah Wilson</h4>
                      <p className="text-sm text-gray-600">Pediatric Specialist</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "HealthSync makes it easy for me to access patient medical history quickly. This greatly helps in
                    providing more accurate diagnoses and better care."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">JS</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">John Smith</h4>
                      <p className="text-sm text-gray-600">Patient</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "I no longer need to carry physical medical record files when visiting doctors. All my health data
                    is stored neatly and easily accessible through HealthSync."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                      <div className="flex h-full items-center justify-center text-lg font-bold text-white">MD</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Maria Davis</h4>
                      <p className="text-sm text-gray-600">Hospital Director</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "Implementing HealthSync in our hospital has significantly improved operational efficiency and
                    patient satisfaction. This system truly transforms how we manage health data."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Join now and experience the convenience of digital healthcare access
              </h2>
              <p className="mb-8 text-lg text-white/90">Start your journey to better health with HealthSync</p>
              <Link href="/register">
                <Button className="rounded-full bg-white px-8 py-6 text-lg font-bold text-[#3FB6F6] hover:bg-gray-100">
                  Sign Up Now
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
                Contact
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                FAQ
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-[#3FB6F6]">
                Privacy Policy
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
            <p className="text-sm text-gray-600">© 2025 HealthSync. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
