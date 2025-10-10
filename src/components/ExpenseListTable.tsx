import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Transaction } from '../types'

interface ExpenseListTableProps {
  expenses: Transaction[]
}

export const ExpenseListTable: React.FC<ExpenseListTableProps> = ({ expenses }) => {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const expensesPerPage = 10

  const filteredExpenses = expenses.filter((e) =>
    e.category?.toLowerCase().includes(query.toLowerCase())
  )

  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage)
  const indexOfLastExpense = currentPage * expensesPerPage
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense)

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
            placeholder="Search expenses..."
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
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                currentExpenses.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(e.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {e.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      £{e.amount.toFixed(2)}
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
          Showing {indexOfFirstExpense + 1} to{' '}
          {Math.min(indexOfLastExpense, filteredExpenses.length)} of{' '}
          {filteredExpenses.length} results
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