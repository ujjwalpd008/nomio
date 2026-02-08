'use client'

import { useEffect, useState } from 'react'
import NomineeLayout from '@/components/NomineeLayout'
import { FileText, Download, Building2 } from 'lucide-react'

interface Document {
  id: string
  title: string
  fileName: string
  filePath: string
  account: {
    institutionName: string
    accountType: string
  }
}

export default function NomineeDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nominee/accounts')
      .then((res) => res.json())
      .then((data) => {
        // Flatten all critical documents from all accounts
        const allDocs: Document[] = []
        data.accounts?.forEach((account: any) => {
          account.criticalDocuments?.forEach((doc: any) => {
            allDocs.push({
              ...doc,
              account: {
                institutionName: account.institutionName,
                accountType: account.accountType,
              },
            })
          })
        })
        setDocuments(allDocs)
      })
      .catch((error) => {
        console.error('Error fetching documents:', error)
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Critical Documents</h1>
          <p className="text-gray-600">
            Important documents related to your nominated accounts
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents available</h3>
            <p className="text-gray-600">
              There are no critical documents marked for your nominated accounts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.account.institutionName}</p>
                      <p className="text-xs text-gray-500">{doc.account.accountType}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded mb-2">
                    Critical Document
                  </span>
                  <a
                    href={doc.filePath}
                    download
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mt-2"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Critical Documents</h3>
          <p className="text-sm text-blue-800">
            These documents have been marked as critical by the account holder. They may contain
            important information needed to claim your nominated assets. Please download and keep
            these documents safe.
          </p>
        </div>
      </div>
    </NomineeLayout>
  )
}
