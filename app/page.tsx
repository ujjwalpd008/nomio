import Link from 'next/link'
import { ArrowRight, Shield, Users, FileText, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Nominee Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Your Financial Legacy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage all your nominees in one place. Ensure your loved ones can easily access what rightfully belongs to them.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 flex items-center"
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Users className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Centralized Nominee Management</h3>
            <p className="text-gray-600">
              Track all your nominees across banks, mutual funds, insurance, and more in one secure dashboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <FileText className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Storage</h3>
            <p className="text-gray-600">
              Store important documents securely and ensure your nominees have access when needed.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Lock className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Bank-level encryption and security measures to protect your sensitive financial information.
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">The Problem We Solve</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              In India alone, hundreds of crores remain unclaimed because nominees don't know they've been named or what assets they're entitled to.
            </p>
            <p className="text-lg text-gray-700">
              Our platform ensures that your nominees are informed and can easily access their entitlements, preventing unclaimed assets and providing peace of mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
