'use client'

import { useEffect, useState } from 'react'
import NomineeLayout from '@/components/NomineeLayout'
import { User, Phone, Mail, Calendar } from 'lucide-react'

export default function NomineeProfilePage() {
  const [nominee, setNominee] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nominee-auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.nominee) {
          setNominee(data.nominee)
        }
      })
      .catch((error) => {
        console.error('Error fetching nominee:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <NomineeLayout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </NomineeLayout>
    )
  }

  return (
    <NomineeLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold text-gray-900">{nominee?.fullName}</h2>
              <p className="text-gray-600">{nominee?.relationship}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-gray-900 font-medium">{nominee?.phone}</p>
              </div>
            </div>

            {nominee?.email && (
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{nominee.email}</p>
                </div>
              </div>
            )}

            {nominee?.user && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Nominated By</p>
                <p className="text-gray-900 font-medium">
                  {nominee.user.name || nominee.user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Your Access</h3>
          <p className="text-sm text-blue-800 mb-2">
            You have been granted read-only access to view accounts where you have been nominated.
            This portal allows you to:
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>View accounts where you are a nominee</li>
            <li>See your allocation percentage for each account</li>
            <li>Download critical documents related to your nominations</li>
            <li>View your estimated share of assets</li>
          </ul>
        </div>
      </div>
    </NomineeLayout>
  )
}
