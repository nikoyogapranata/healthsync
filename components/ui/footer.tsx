//components\ui\footer.tsx

import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/landing" className="flex items-center mb-6">
              <div className="mr-3 h-10 w-10 overflow-hidden rounded-xl">
                <img
                  src="/illustrations/logo.png"
                  alt="HealthSync Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3FB6F6] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                HealthSync
              </span>
            </Link>
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
  );
}