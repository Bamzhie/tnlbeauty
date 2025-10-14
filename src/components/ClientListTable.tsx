import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react'
import { ClientDetail } from '../types'

interface ClientListTableProps {
  clients?: ClientDetail[]
  show: boolean
  onAddIncome?: () => void
  onClientClick?: (client: ClientDetail) => void
}

export function ClientListTable({ clients, show, onAddIncome, onClientClick }: ClientListTableProps) {
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

  const handleClientClick = (client: ClientDetail) => {
    console.log('Client clicked:', client);
    if (onClientClick) {
      onClientClick(client);
    }
  };

  // CSV Download function for clients
  const downloadClientsCSV = () => {
    if (!filteredClients.length) return;

    const headers = ['Name', 'Service', 'Amount', 'Number of Visits'];
    const csvData = filteredClients.map(client => [
      client.name,
      client.service,
      `£${client.amount.toFixed(2)}`,
      client.numberOfVisits || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Search Bar and Add Button - MOBILE OPTIMIZED */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadClientsCSV}
            disabled={filteredClients.length === 0}
            className={`flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ${
              filteredClients.length === 0 
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download list</span>
          </button>
          <button
            onClick={onAddIncome}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      {/* Table - MOBILE CARD VIEW */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">No clients found</td>
                </tr>
              ) : (
                currentClients.map((c: ClientDetail) => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleClientClick(c)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{c.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">£{c.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      {c.numberOfVisits || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-600">
          {currentClients.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No clients found</div>
          ) : (
            currentClients.map((c: ClientDetail) => (
              <div 
                key={c.id} 
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleClientClick(c)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{c.name}</h3>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">£{c.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{c.service}</span>
                  <span>{c.numberOfVisits || 0} visits</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination - MOBILE OPTIMIZED */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {indexOfFirstClient + 1}-{Math.min(indexOfLastClient, filteredClients.length)} of {filteredClients.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ${
              currentPage === 1 ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">{currentPage}/{totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ${
              currentPage === totalPages ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}