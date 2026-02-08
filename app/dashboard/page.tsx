'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Users, Building2, FileText, Shield, Plus, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-accounts' | 'nominated'>('overview')
  const [stats, setStats] = useState<any>(null)
  const [myAccounts, setMyAccounts] = useState<any[]>([])
  const [nominatedAccounts, setNominatedAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchNominatedAccounts() // Fetch nominated accounts count on initial load
  }, [])

  useEffect(() => {
    if (activeTab === 'my-accounts') {
      fetchMyAccounts()
    } else if (activeTab === 'nominated') {
      fetchNominatedAccounts()
    }
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      setStats(data.stats)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  const fetchMyAccounts = async () => {
    try {
      const res = await fetch('/api/dashboard/my-accounts')
      const data = await res.json()
      setMyAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error fetching my accounts:', error)
    }
  }

  const fetchNominatedAccounts = async () => {
    try {
      const res = await fetch('/api/dashboard/nominated-accounts')
      const data = await res.json()
      setNominatedAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error fetching nominated accounts:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    )
  }

  const statCards = [
    {
      title: 'My Accounts',
      value: stats?.accountCount || 0,
      icon: Building2,
      href: '#',
      color: 'bg-blue-500',
      onClick: () => setActiveTab('my-accounts'),
    },
    {
      title: 'Nominated For',
      value: nominatedAccounts.length,
      icon: Users,
      href: '#',
      color: 'bg-green-500',
      onClick: () => setActiveTab('nominated'),
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats?.totalValue || 0),
      icon: Building2,
      href: '/accounts',
      color: 'bg-purple-500',
    },
    {
      title: 'Documents',
      value: stats?.documentCount || 0,
      icon: FileText,
      href: '/documents',
      color: 'bg-orange-500',
    },
    {
      title: 'Nominees',
      value: stats?.nomineeCount || 0,
      icon: Users,
      href: '/nominees',
      color: 'bg-indigo-500',
    },
    {
      title: 'Trusted Contacts',
      value: stats?.trustedContactCount || 0,
      icon: Shield,
      href: '/trusted-contacts',
      color: 'bg-red-500',
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your accounts and view accounts you&apos;re nominated for</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('my-accounts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-accounts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Accounts ({stats?.accountCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('nominated')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'nominated'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nominated For ({nominatedAccounts.length})
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card) => {
                const Icon = card.icon
                const Component = card.onClick ? 'button' : Link
                const props = card.onClick
                  ? { onClick: card.onClick, className: 'bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full text-left' }
                  : { href: card.href, className: 'bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow' }
                
                return (
                  <Component key={card.title} {...props}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      </div>
                      <div className={`${card.color} p-3 rounded-lg flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </Component>
                )
              })}
            </div>
          </>
        )}

        {/* My Accounts Tab */}
        {activeTab === 'my-accounts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Accounts</h2>
              <Link
                href="/accounts/new"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Account
              </Link>
            </div>

            {myAccounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts yet</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first account</p>
                <Link
                  href="/accounts/new"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-block"
                >
                  Add Account
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myAccounts.map((account) => (
                  <div key={account.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">{account.institutionName}</h3>
                          <span className="ml-3 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            {account.accountType}
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                              account.status === 'Active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {account.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Account Number: {account.accountNumber}
                        </p>
                        {account.approximateValue && (
                          <p className="text-sm font-medium text-gray-900">
                            Approximate Value: {formatCurrency(account.approximateValue)}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/accounts/${account.id}/edit`}
                          className="p-2 text-gray-600 hover:text-primary-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    {account.accountNominees && account.accountNominees.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nominees:</p>
                        <div className="space-y-1">
                          {account.accountNominees.map((an: any, idx: number) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {an.nominee?.fullName || an.user?.name} - {an.allocationPercentage}%
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nominated Accounts Tab */}
        {activeTab === 'nominated' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Accounts I&apos;m Nominated For</h2>

            {nominatedAccounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No nominations yet</h3>
                <p className="text-gray-600">
                  You haven&apos;t been nominated for any accounts. When someone adds you as a nominee, 
                  those accounts will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {nominatedAccounts.map((account) => {
                  const yourShare = account.approximateValue
                    ? (account.approximateValue * account.allocationPercentage) / 100
                    : null

                  return (
                    <div key={account.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {account.institutionName}
                            </h3>
                            <span className="ml-3 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              {account.accountType}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                                account.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {account.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Account Number: {account.accountNumber}
                          </p>
                          {account.accountOwner && (
                            <p className="text-sm text-gray-600 mb-2">
                              Account Owner: {account.accountOwner.name || account.accountOwner.email}
                            </p>
                          )}
                          {account.approximateValue && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Total Value: {formatCurrency(account.approximateValue)}
                              </p>
                              <p className="text-sm font-medium text-primary-600">
                                Your Share ({account.allocationPercentage}%):{' '}
                                {yourShare ? formatCurrency(yourShare) : 'N/A'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Other Nominees */}
                      {account.allNominees && account.allNominees.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">All Nominees:</p>
                          <div className="space-y-1">
                            {account.allNominees.map((nom: any, idx: number) => (
                              <p key={idx} className="text-sm text-gray-600">
                                {nom.name} - {nom.allocationPercentage}%
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Critical Documents */}
                      {account.criticalDocuments && account.criticalDocuments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Critical Documents:</p>
                          <div className="space-y-2">
                            {account.criticalDocuments.map((doc: any) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-2 bg-red-50 rounded"
                              >
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-red-600 mr-2" />
                                  <span className="text-sm text-gray-900">{doc.title}</span>
                                </div>
                                <a
                                  href={doc.filePath}
                                  download
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
