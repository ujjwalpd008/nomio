'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, User, CheckCircle, Bell, X, XCircle } from 'lucide-react'

interface Nominee {
  id: string
  fullName: string
  relationship: string
  email: string | null
  phone: string
  dateOfBirth: string | null
  panNumber: string | null
  address: string | null
  userId: string | null
  notificationChannels: string[]
  notificationFrequency: string | null
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
  } | null
}

export default function NomineesPage() {
  const router = useRouter()
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null)
  const [notificationChannels, setNotificationChannels] = useState<string[]>([])
  const [notificationFrequency, setNotificationFrequency] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNominees()
  }, [])

  const fetchNominees = async () => {
    try {
      const res = await fetch('/api/nominees')
      const data = await res.json()
      setNominees(data.nominees || [])
    } catch (error) {
      console.error('Error fetching nominees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nominee?')) return

    try {
      const res = await fetch(`/api/nominees/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchNominees()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete nominee')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const handleNudge = async (nomineeId: string, nomineeName: string) => {
    const message = prompt(`Send a nudge to ${nomineeName}:\n\nEnter your message (max 500 characters):`)
    
    if (!message || message.trim().length === 0) {
      return
    }

    if (message.length > 500) {
      alert('Message is too long. Maximum 500 characters allowed.')
      return
    }

    try {
      const res = await fetch('/api/nudges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomineeId, message: message.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Nudge sent to ${nomineeName}! They will see this message when they log in.`)
      } else {
        alert(data.error || 'Failed to send nudge')
      }
    } catch (error) {
      alert('An error occurred while sending nudge')
    }
  }

  const handleNotificationSettings = async (nominee: Nominee) => {
    setSelectedNominee(nominee)
    setNotificationChannels(nominee.notificationChannels || [])
    setNotificationFrequency(nominee.notificationFrequency || '')
    setShowNotificationModal(true)
  }

  const handleSaveNotificationSettings = async () => {
    if (!selectedNominee) return

    setSaving(true)
    try {
      const res = await fetch(`/api/nominees/${selectedNominee.id}/notification-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationChannels,
          notificationFrequency: notificationFrequency || null,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Notification settings saved successfully!')
        setShowNotificationModal(false)
        fetchNominees()
      } else {
        alert(data.error || 'Failed to save notification settings')
      }
    } catch (error) {
      alert('An error occurred while saving settings')
    } finally {
      setSaving(false)
    }
  }

  const toggleChannel = (channel: string) => {
    if (notificationChannels.includes(channel)) {
      setNotificationChannels(notificationChannels.filter(c => c !== channel))
    } else {
      setNotificationChannels([...notificationChannels, channel])
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nominees</h1>
            <p className="text-gray-600">Manage your nominee information</p>
          </div>
          <button
            onClick={() => router.push('/nominees/new')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Nominee
          </button>
        </div>

        {nominees.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No nominees yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first nominee</p>
            <button
              onClick={() => router.push('/nominees/new')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Add Nominee
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name & Relationship
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notifications
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nominees.map((nominee) => (
                    <tr key={nominee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-primary-100 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{nominee.fullName}</div>
                            <div className="text-sm text-gray-500">{nominee.relationship}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {nominee.phone && (
                            <div className="mb-1">
                              <span className="text-gray-500">Phone:</span> {nominee.phone}
                            </div>
                          )}
                          {nominee.email && (
                            <div>
                              <span className="text-gray-500">Email:</span> {nominee.email}
                            </div>
                          )}
                          {nominee.panNumber && (
                            <div className="mt-1 text-xs text-gray-500">
                              <span className="text-gray-500">PAN:</span> {nominee.panNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {nominee.userId ? (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Signed up</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-red-400">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span>Not registered</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {nominee.notificationChannels?.length > 0 || nominee.notificationFrequency ? (
                            <div>
                              {nominee.notificationChannels?.length > 0 && (
                                <div className="mb-1">
                                  <span className="text-gray-500">Channels:</span>{' '}
                                  <span className="font-medium">{nominee.notificationChannels.join(', ')}</span>
                                </div>
                              )}
                              {nominee.notificationFrequency && (
                                <div>
                                  <span className="text-gray-500">Frequency:</span>{' '}
                                  <span className="font-medium">{nominee.notificationFrequency}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Not configured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleNotificationSettings(nominee)}
                            className="flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 transition-colors rounded"
                            title="Configure notification settings"
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/nominees/${nominee.id}/edit`)}
                            className="flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 transition-colors rounded"
                            title="Edit nominee"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(nominee.id)}
                            className="flex items-center justify-center p-2 text-gray-600 hover:text-red-600 transition-colors rounded"
                            title="Delete nominee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notification Settings Modal */}
        {showNotificationModal && selectedNominee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Notification Settings
                </h2>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Configure how <strong>{selectedNominee.fullName}</strong> should be notified about their nominated accounts.
                </p>
              </div>

              <div className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notification Channels
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationChannels.includes('Email')}
                        onChange={() => toggleChannel('Email')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Email {selectedNominee.email ? `(${selectedNominee.email})` : '(not provided)'}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationChannels.includes('WhatsApp')}
                        onChange={() => toggleChannel('WhatsApp')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        WhatsApp {selectedNominee.phone ? `(${selectedNominee.phone})` : '(not provided)'}
                      </span>
                    </label>
                  </div>
                  {notificationChannels.length === 0 && (
                    <p className="mt-2 text-xs text-red-600">
                      Please select at least one notification channel
                    </p>
                  )}
                </div>

                {/* Notification Frequency */}
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Frequency
                  </label>
                  <select
                    id="frequency"
                    value={notificationFrequency}
                    onChange={(e) => setNotificationFrequency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="Quarterly">Quarterly (Once every 3 months)</option>
                    <option value="HalfYearly">Half-Yearly (Once every 6 months)</option>
                    <option value="Annually">Annually (Once a year)</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    How often should {selectedNominee.fullName} be notified about their nominated accounts?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSaveNotificationSettings}
                  disabled={saving || notificationChannels.length === 0 || !notificationFrequency}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
