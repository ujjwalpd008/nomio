'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Bell, CheckCircle, X, User, Mail } from 'lucide-react'

interface Nudge {
  id: string
  message: string
  status: string
  createdAt: string
  readAt: string | null
  fromUser: {
    name: string | null
    email: string
  }
  toNominee: {
    fullName: string
  } | null
}

export default function NotificationsPage() {
  const [nudges, setNudges] = useState<Nudge[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNudges()
  }, [])

  const fetchNudges = async () => {
    try {
      const res = await fetch('/api/nudges')
      const data = await res.json()
      setNudges(data.received || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching nudges:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (nudgeId: string) => {
    try {
      const res = await fetch(`/api/nudges/${nudgeId}/read`, { method: 'POST' })
      if (res.ok) {
        fetchNudges()
      }
    } catch (error) {
      console.error('Error marking nudge as read:', error)
    }
  }

  const handleMarkAsRead = (nudge: Nudge) => {
    if (nudge.status === 'Unread') {
      markAsRead(nudge.id)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    )
  }

  const unreadNudges = nudges.filter(n => n.status === 'Unread')
  const readNudges = nudges.filter(n => n.status === 'Read')

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            Messages and nudges from account holders who have nominated you
          </p>
        </div>

        {nudges.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              You don't have any nudges or messages yet. When someone sends you a nudge, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unread Section */}
            {unreadNudges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary-600" />
                  Unread ({unreadNudges.length})
                </h2>
                <div className="space-y-4">
                  {unreadNudges.map((nudge) => (
                    <div
                      key={nudge.id}
                      className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleMarkAsRead(nudge)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-900">
                              {nudge.fromUser.name || nudge.fromUser.email}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">
                              sent you a nudge
                            </span>
                          </div>
                          <p className="text-gray-800 mb-2 pl-7">{nudge.message}</p>
                          <p className="text-xs text-gray-500 pl-7">
                            {new Date(nudge.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(nudge)
                          }}
                          className="ml-4 p-2 text-blue-600 hover:text-blue-800"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Section */}
            {readNudges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Read</h2>
                <div className="space-y-4">
                  {readNudges.map((nudge) => (
                    <div
                      key={nudge.id}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="font-semibold text-gray-900">
                              {nudge.fromUser.name || nudge.fromUser.email}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">
                              sent you a nudge
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          </div>
                          <p className="text-gray-700 mb-2 pl-7">{nudge.message}</p>
                          <p className="text-xs text-gray-500 pl-7">
                            {new Date(nudge.createdAt).toLocaleString()}
                            {nudge.readAt && ` • Read ${new Date(nudge.readAt).toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Nudges</h3>
          <p className="text-sm text-blue-800">
            Account holders can send you nudges to remind you about accounts you're nominated for, 
            ask you to sign up, or share important information. These messages help ensure you're 
            aware of your entitlements and can claim them when needed.
          </p>
        </div>
      </div>
    </Layout>
  )
}
