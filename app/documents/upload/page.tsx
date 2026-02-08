'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

interface Account {
  id: string
  institutionName: string
  accountType: string
}

export default function UploadDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    accountId: '',
    isCritical: false,
    file: null as File | null,
  })

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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      setFormData({ ...formData, file, title: formData.title || file.name })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file) {
      alert('Please select a file')
      return
    }

    setLoading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', formData.file)
      uploadData.append('title', formData.title)
      uploadData.append('description', formData.description)
      if (formData.accountId) {
        uploadData.append('accountId', formData.accountId)
      }
      uploadData.append('isCritical', formData.isCritical.toString())

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: uploadData,
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/documents')
      } else {
        alert(data.error || 'Failed to upload document')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Important Documents</h1>
          <p className="text-gray-600">
            Store documents that will help your nominees claim their assets. These documents are critical for the claim process.
          </p>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Why upload documents?</h3>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Help nominees identify and claim accounts/assets they&apos;re entitled to</li>
            <li>Provide necessary paperwork for financial institutions</li>
            <li>Store account statements, policy documents, or claim forms</li>
            <li>Mark critical documents that nominees must access</li>
            <li>Ensure smooth asset transfer process</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Document File * (PDF, JPG, PNG - Max 10MB)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Examples: Account statements, policy documents, nomination forms, claim documents, etc.
            </p>
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Document Title *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Give a clear, descriptive title (e.g., &quot;Bank Account Statement - HDFC&quot;, &quot;Life Insurance Policy Document&quot;)
            </p>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Add any additional context or instructions for nominees (e.g., &quot;Keep this for claim process&quot;, &quot;Required by institution&quot;)
            </p>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
              Link to Account (Recommended)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Link this document to a specific account so nominees know which account it relates to
            </p>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">None</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.institutionName} - {account.accountType}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                id="isCritical"
                name="isCritical"
                type="checkbox"
                checked={formData.isCritical}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <div className="ml-3">
                <label htmlFor="isCritical" className="block text-sm font-medium text-yellow-900">
                  Mark as critical for nominees
                </label>
                <p className="text-xs text-yellow-800 mt-1">
                  Critical documents will be visible to nominees and are essential for the claim process. 
                  Examples: Account statements, policy documents, nomination certificates, claim forms.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
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
