import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { ClientDetail } from '../types'

interface ClientListTableProps {
  clients?: ClientDetail[]
  show: boolean
}

export function ClientListTable  ({ clients, show }: any)  {
  if (!show) return null;

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const filteredClients = (clients || []).filter((c: ClientDetail) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.service.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div>
      {/* Search Bar - MOBILE OPTIMIZED */}
      <div className="mb-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table - MOBILE CARD VIEW */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No clients found</td>
                </tr>
              ) : (
                currentClients.map((c: ClientDetail) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">£{c.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {c.date ? new Date(c.date).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {currentClients.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No clients found</div>
          ) : (
            currentClients.map((c: ClientDetail) => (
              <div key={c.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{c.name}</h3>
                  <span className="text-sm font-semibold text-blue-600">£{c.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{c.service}</span>
                  <span>{c.date ? new Date(c.date).toLocaleDateString('en-GB') : 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination - MOBILE OPTIMIZED */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-gray-700">
          {indexOfFirstClient + 1}-{Math.min(indexOfLastClient, filteredClients.length)} of {filteredClients.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm border rounded-lg ${
              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-700">{currentPage}/{totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm border rounded-lg ${
              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

