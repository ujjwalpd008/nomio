'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { Plus, Trash2, FileText, Download } from 'lucide-react'

interface Document {
  id: string
  title: string
  fileName: string
  filePath: string
  isCritical: boolean
  account: {
    institutionName: string
  } | null
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents')
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDocuments()
      } else {
        alert('Failed to delete document')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Important Documents</h1>
            <p className="text-gray-600">
              Store documents that help nominees claim their assets. Critical documents are visible to nominees.
            </p>
          </div>
          <button
            onClick={() => router.push('/documents/upload')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Upload Document
          </button>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Upload account statements, policy documents, and claim forms. 
            Mark documents as "Critical" to ensure nominees can access them when needed for the claim process.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents uploaded yet</h3>
            <p className="text-gray-600 mb-2">
              Start uploading important documents that will help your nominees claim their assets.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Examples: Account statements, insurance policies, nomination forms, claim documents
            </p>
            <button
              onClick={() => router.push('/documents/upload')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-primary-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                      {doc.account && (
                        <p className="text-sm text-gray-600">{doc.account.institutionName}</p>
                      )}
                    </div>
                  </div>
                </div>
                {doc.isCritical && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                      🔴 Critical for Nominees
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Visible to nominees - essential for claim process
                    </p>
                  </div>
                )}
                {!doc.isCritical && (
                  <p className="text-xs text-gray-500 mb-2">
                    Not marked as critical - only visible to you
                  </p>
                )}
                <div className="flex space-x-2 mt-4">
                  <a
                    href={doc.filePath}
                    download
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
