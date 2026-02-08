'use client'

import { useEffect, useState } from 'react'
import NomineeLayout from '@/components/NomineeLayout'
import { Building2, FileText, Download, Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface Account {
  id: string
  accountType: string
  institutionName: string
  accountNumber: string
  approximateValue: number | null
  status: string
  allocationPercentage: number
  allNominees: Array<{
    fullName: string
    allocationPercentage: number
  }>
  criticalDocuments: Array<{
    id: string
    title: string
    fileName: string
    filePath: string
  }>
}

export default function NomineeDashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [nominee, setNominee] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/nominee-auth/me').then((res) => res.json()),
      fetch('/api/nominee/accounts').then((res) => res.json()),
    ])
      .then(([nomineeData, accountsData]) => {
        if (nomineeData.nominee) {
          setNominee(nomineeData.nominee)
        }
        if (accountsData.accounts) {
          setAccounts(accountsData.accounts)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
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

  const totalValue = accounts.reduce((sum, acc) => {
    if (acc.approximateValue) {
      return sum + (acc.approximateValue * acc.allocationPercentage) / 100
    }
    return sum
  }, 0)

  return (
    <NomineeLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Nominated Accounts</h1>
          <p className="text-gray-600">
            Welcome, {nominee?.fullName}. Here are the accounts where you have been nominated.
          </p>
        </div>

        {/* Summary Card */}
        {accounts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Estimated Share</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Critical Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.reduce((sum, acc) => sum + acc.criticalDocuments.length, 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts found</h3>
            <p className="text-gray-600">
              You haven&apos;t been nominated for any accounts yet. Please contact the account holder.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {accounts.map((account) => {
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
                  {account.allNominees.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">All Nominees:</p>
                      <div className="space-y-1">
                        {account.allNominees.map((nom, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {nom.fullName} - {nom.allocationPercentage}%
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critical Documents */}
                  {account.criticalDocuments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Critical Documents:</p>
                      <div className="space-y-2">
                        {account.criticalDocuments.map((doc) => (
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
                              <Download className="h-4 w-4" />
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

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Information</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>This is a read-only view of accounts where you have been nominated</li>
            <li>You can view critical documents related to these accounts</li>
            <li>To claim these assets, you will need to contact the respective financial institutions</li>
            <li>This platform is for informational purposes only</li>
          </ul>
        </div>
      </div>
    </NomineeLayout>
  )
}
