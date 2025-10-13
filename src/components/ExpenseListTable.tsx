import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react'
import { Transaction } from '../types'

interface ExpenseListTableProps {
  expenses: Transaction[]
  onAddExpense?: () => void
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

  // CSV Download function for expenses
  const downloadExpensesCSV = () => {
    if (!filteredExpenses.length) return;

    const headers = ['Date', 'Category', 'Amount'];
    const csvData = filteredExpenses.map(expense => [
      new Date(expense.date).toLocaleDateString('en-GB'),
      expense.category || 'Uncategorized',
      `£${expense.amount.toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Search Bar and Add Button */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadExpensesCSV}
            disabled={filteredExpenses.length === 0}
            className={`flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ${
              filteredExpenses.length === 0 
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download list</span>
          </button>
          <button
            onClick={onAddExpense}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400">No expenses found</td>
                </tr>
              ) : (
                currentExpenses.map((e: Transaction) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      {new Date(e.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">{e.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">£{e.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-600">
          {currentExpenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No expenses found</div>
          ) : (
            currentExpenses.map((e: Transaction) => (
              <div key={e.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{e.category}</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">£{e.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(e.date).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {indexOfFirstExpense + 1}-{Math.min(indexOfLastExpense, filteredExpenses.length)} of {filteredExpenses.length}
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