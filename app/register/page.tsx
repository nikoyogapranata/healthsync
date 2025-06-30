import { Suspense } from 'react'
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
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join HealthSync</h1>
            <p className="text-gray-600">Create your account to start managing your health data securely</p>
          </div>

          {/* Registration Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <Suspense fallback={<div className="flex justify-center items-center h-32">Loading...</div>}>
              <RegistrationForm />
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

      {/* Right Side - Full Image Background */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/illustrations/signin-signup.jpg"
          alt="A secure and modern healthcare platform interface"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#34D399]/80 via-[#3FB6F6]/80 to-[#10B981]/80"></div>

        {/* Logo - Stays at the top-right corner */}
        <div className="absolute top-8 right-8 z-20 flex items-center">
          <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl bg-white p-1 shadow-md">
            <img
              src="/illustrations/logo.png"
              alt="HealthSync Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-white">HealthSync</span>
        </div>

        {/* Centered Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-lg space-y-6">
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
          <div className="mt-12 space-y-4 max-w-lg w-full text-left">
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
      </div>
    </div>
  )
}