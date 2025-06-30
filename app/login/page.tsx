import { Suspense } from 'react'
import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Full Image Background */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/illustrations/signin-signup.jpg"
          alt="A secure and modern healthcare platform interface"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-slate-900/80"></div>

        
        {/* Centered Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-lg space-y-6">
            {/* --- Logo's New Position --- */}
            <Link href="/landing" className="flex items-center justify-center mb-12">
              <div className="mr-3 h-12 w-12 overflow-hidden rounded-xl bg-white p-1.5 shadow-md">
                <img
                  src="/illustrations/logo.png"
                  alt="HealthSync Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3FB6F6] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">HealthSync</span>
            </Link>
            
            <h2 className="text-4xl font-bold text-white leading-tight">Welcome Back to HealthSync</h2>
            <p className="text-xl text-white/90 leading-relaxed">"Your Health, Your Data, Your Control."</p>
            <p className="text-lg text-white/80 leading-relaxed">
              Access your complete medical history securely from anywhere. Join thousands of patients who trust
              HealthSync for their healthcare management.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center max-w-lg">
            <div>
              <div className="text-2xl font-bold text-[#34D399] mb-1">256-bit</div>
              <div className="text-sm text-white/80">Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#34D399] mb-1">HIPAA</div>
              <div className="text-sm text-white/80">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#34D399] mb-1">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/landing" className="flex items-center justify-center mb-8 lg:hidden">
            <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl">
              <img
                src="/illustrations/logo.png"
                alt="HealthSync Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              HealthSync
            </span>
          </Link>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your medical records</p>
          </div>

          {/* Login Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <Suspense fallback={<div className="flex justify-center items-center h-32">Loading...</div>}>
              <LoginForm />
            </Suspense>
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
