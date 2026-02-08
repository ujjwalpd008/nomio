'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react'

interface NomineeLayoutProps {
  children: React.ReactNode
}

export default function NomineeLayout({ children }: NomineeLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [nominee, setNominee] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/nominee-auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.nominee) {
          setNominee(data.nominee)
        } else {
          router.push('/nominee-login')
        }
      })
      .catch(() => router.push('/nominee-login'))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/nominee-auth/logout', { method: 'POST' })
    router.push('/nominee-login')
  }

  const navItems = [
    { href: '/nominee/dashboard', label: 'My Accounts', icon: LayoutDashboard },
    { href: '/nominee/documents', label: 'Documents', icon: FileText },
    { href: '/nominee/profile', label: 'Profile', icon: User },
  ]

  if (!nominee) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' : ''
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center px-4 py-6 border-b border-gray-200">
            <User className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Nominee Portal</span>
          </div>
          <nav className="flex-1 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' : ''
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="mb-2 text-sm font-medium text-gray-900">{nominee.fullName}</div>
            <div className="mb-2 text-xs text-gray-600">{nominee.phone}</div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">Nominee Portal</h1>
          <div className="w-6" />
        </div>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
