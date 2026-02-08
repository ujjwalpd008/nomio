'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'

interface TrustedContact {
  id: string
  name: string
  email: string
  phone: string
}

export default function TrustedContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<TrustedContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/trusted-contacts')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching trusted contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trusted contact?')) return

    try {
      const res = await fetch(`/api/trusted-contacts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchContacts()
      } else {
        alert('Failed to delete trusted contact')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trusted Contacts</h1>
            <p className="text-gray-600">Manage trusted contacts who can initiate emergency access</p>
          </div>
          {contacts.length < 3 && (
            <button
              onClick={() => router.push('/trusted-contacts/new')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Contact
            </button>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trusted contacts yet</h3>
            <p className="text-gray-600 mb-6">Add trusted contacts who can initiate emergency access if needed</p>
            <button
              onClick={() => router.push('/trusted-contacts/new')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Add Trusted Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/trusted-contacts/${contact.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {contact.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {contact.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {contacts.length >= 3 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              You have reached the maximum limit of 3 trusted contacts.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
