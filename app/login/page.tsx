import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Enhanced Illustration */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-[#3FB6F6] via-[#34D399] to-[#10B981] p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center">
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
                  alt="HealthSync - Secure Healthcare Access"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">Welcome Back to HealthSync</h2>
            <p className="text-xl text-white/90 leading-relaxed">"Your Health, Your Data, Your Control."</p>
            <p className="text-lg text-white/80 leading-relaxed">
              Access your complete medical history securely from anywhere. Join thousands of patients who trust
              HealthSync for their healthcare management.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">256-bit</div>
              <div className="text-sm text-white/80">Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">HIPAA</div>
              <div className="text-sm text-white/80">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your medical records</p>
          </div>

          {/* Login Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <LoginForm />
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
    </div>
  )
}
