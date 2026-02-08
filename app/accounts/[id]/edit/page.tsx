'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Layout from '@/components/Layout'

interface Nominee {
  id: string
  fullName: string
}

export default function EditAccountPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [formData, setFormData] = useState({
    accountType: 'Bank Account',
    institutionName: '',
    accountNumber: '',
    approximateValue: '',
    status: 'Active',
    notes: '',
    nominees: [] as Array<{ nomineeId: string; allocationPercentage: number }>,
  })

  useEffect(() => {
    Promise.all([fetchAccount(), fetchNominees()])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/accounts')
      const data = await res.json()
      const account = data.accounts?.find((a: any) => a.id === params.id)
      if (account) {
        setFormData({
          accountType: account.accountType,
          institutionName: account.institutionName,
          accountNumber: account.accountNumber,
          approximateValue: account.approximateValue?.toString() || '',
          status: account.status,
          notes: account.notes || '',
          nominees: account.accountNominees?.map((an: any) => ({
            nomineeId: an.nominee.id,
            allocationPercentage: an.allocationPercentage,
          })) || [],
        })
      }
    } catch (error) {
      console.error('Error fetching account:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNominees = async () => {
    try {
      const res = await fetch('/api/nominees')
      const data = await res.json()
      setNominees(data.nominees || [])
    } catch (error) {
      console.error('Error fetching nominees:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNomineeChange = (nomineeId: string, percentage: number) => {
    const updated = formData.nominees.filter((n) => n.nomineeId !== nomineeId)
    if (percentage > 0) {
      updated.push({ nomineeId, allocationPercentage: percentage })
    }
    setFormData({ ...formData, nominees: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.nominees.length > 0) {
      const total = formData.nominees.reduce((sum, n) => sum + n.allocationPercentage, 0)
      if (Math.abs(total - 100) > 0.01) {
        alert('Nominee allocation percentages must total 100%')
        return
      }
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/accounts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          approximateValue: formData.approximateValue ? parseFloat(formData.approximateValue) : undefined,
          nominees: formData.nominees.length > 0 ? formData.nominees : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/accounts')
      } else {
        alert(data.error || 'Failed to update account')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const getTotalAllocation = () => {
    return formData.nominees.reduce((sum, n) => sum + n.allocationPercentage, 0)
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Account</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type *
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Bank Account">Bank Account</option>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Term Insurance">Term Insurance</option>
              <option value="Demat Account">Demat Account</option>
              <option value="PPF">PPF</option>
              <option value="EPF">EPF</option>
              <option value="NPS">NPS</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
              Institution Name *
            </label>
            <input
              id="institutionName"
              name="institutionName"
              type="text"
              value={formData.institutionName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number *
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="approximateValue" className="block text-sm font-medium text-gray-700 mb-1">
                Approximate Value (₹)
              </label>
              <input
                id="approximateValue"
                name="approximateValue"
                type="number"
                value={formData.approximateValue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {nominees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Link Nominees (Optional)
              </label>
              <div className="space-y-3">
                {nominees.map((nominee) => {
                  const allocation = formData.nominees.find((n) => n.nomineeId === nominee.id)?.allocationPercentage || 0
                  return (
                    <div key={nominee.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{nominee.fullName}</p>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={allocation}
                          onChange={(e) =>
                            handleNomineeChange(nominee.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="%"
                        />
                      </div>
                    </div>
                  )
                })}
                {formData.nominees.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className={`text-sm font-medium ${Math.abs(getTotalAllocation() - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                      Total: {getTotalAllocation().toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
