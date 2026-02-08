'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, Building2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Account {
  id: string
  accountType: string
  institutionName: string
  accountNumber: string
  approximateValue: number | null
  status: string
  accountNominees: Array<{
    allocationPercentage: number
    nominee: {
      fullName: string
    }
  }>
}

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts')
      const data = await res.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAccounts()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete account')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts</h1>
            <p className="text-gray-600">Manage your financial accounts and assets</p>
          </div>
          <button
            onClick={() => router.push('/accounts/new')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Account
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first account</p>
            <button
              onClick={() => router.push('/accounts/new')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Add Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
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
                    <button
                      onClick={() => router.push(`/accounts/${account.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {account.accountNominees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nominees:</p>
                    <div className="space-y-1">
                      {account.accountNominees.map((an, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {an.nominee.fullName} - {an.allocationPercentage}%
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
    </Layout>
  )
}
