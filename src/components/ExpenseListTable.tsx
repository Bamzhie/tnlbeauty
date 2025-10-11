import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Transaction } from '../types'

interface ExpenseListTableProps {
  expenses: Transaction[]
  onAddExpense?: () => void // Added prop for handling add expense
}

export function ExpenseListTable({ expenses, onAddExpense }: ExpenseListTableProps) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 10;

  const filteredExpenses = expenses.filter((e: Transaction) =>
    e.category?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  return (
    <div>
      {/* Search Bar and Add Button */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAddExpense}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">No expenses found</td>
                </tr>
              ) : (
                currentExpenses.map((e: Transaction) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(e.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">£{e.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {currentExpenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No expenses found</div>
          ) : (
            currentExpenses.map((e: Transaction) => (
              <div key={e.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">{e.category}</span>
                  <span className="text-sm font-semibold text-red-600">£{e.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(e.date).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-gray-700">
          {indexOfFirstExpense + 1}-{Math.min(indexOfLastExpense, filteredExpenses.length)} of {filteredExpenses.length}
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