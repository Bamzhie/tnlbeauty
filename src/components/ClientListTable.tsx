import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { ClientDetail } from '../types'

interface ClientListTableProps {
  clients?: ClientDetail[]
  show: boolean
}

export const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  show,
}) => {
  if (!show) return null

  const dummyClients: ClientDetail[] = [
    { id: 'CL001', name: 'John Doe', service: 'Consultation', amount: 200, date: '2025-10-08' },
    { id: 'CL002', name: 'Jane Smith', service: 'Web Design', amount: 350, date: '2025-10-07' },
    { id: 'CL003', name: 'Michael Lee', service: 'Marketing', amount: 150, date: '2025-10-06' },
    { id: 'CL004', name: 'Aisha Bello', service: 'Product Audit', amount: 280, date: '2025-10-05' },
  ]

  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const clientsPerPage = 10

  const filteredClients = (clients || dummyClients)
    .filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.service.toLowerCase().includes(query.toLowerCase())
    )

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pl-9 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                currentClients.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      £{c.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {c.date ? new Date(c.date).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstClient + 1} to{' '}
          {Math.min(indexOfLastClient, filteredClients.length)} of{' '}
          {filteredClients.length} results
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            } transition-colors`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            } transition-colors`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}