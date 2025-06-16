import { RegistrationForm } from "@/components/registration-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Enhanced Registration Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#3FB6F6] to-[#34D399]">
              <div className="flex h-full items-center justify-center text-lg font-bold text-white">HS</div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              HealthSync
            </span>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join HealthSync</h1>
            <p className="text-gray-600">Create your account to start managing your health data securely</p>
          </div>

          {/* Registration Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <RegistrationForm />
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Help
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Illustration */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-[#34D399] via-[#3FB6F6] to-[#10B981] p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Logo */}
        <div className="absolute top-8 right-8 flex items-center">
          <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl bg-white/20 backdrop-blur-sm">
            <div className="flex h-full items-center justify-center text-lg font-bold text-white">HS</div>
          </div>
          <span className="text-xl font-bold text-white">HealthSync</span>
        </div>

        <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
          <div className="mb-12 w-full max-w-sm">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl"></div>
              <div className="relative aspect-square w-full">
                <Image
                  src="/illustrations/signin-signup.jpg"
                  alt="HealthSync - Digital Healthcare Registration"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">Start Your Health Journey</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              "Register and manage your health data easily and securely."
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Join our secure platform and take control of your medical records. Connect with healthcare providers and
              access your health data from anywhere.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Secure, encrypted medical records</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Access from any healthcare facility</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Real-time health analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">24/7 customer support</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
