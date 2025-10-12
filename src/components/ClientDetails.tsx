import { X, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { Client, Transaction } from '../types';

interface ClientDetailsProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  allClients: Client[];
}

export function ClientDetails({ client, isOpen, onClose, transactions, allClients }: ClientDetailsProps) {
  if (!client) return null;

  // Get all visits for this client
  const clientVisits = allClients
    .filter(c => c.name === client.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get all income transactions for this client
  const clientTransactions = transactions
    .filter(t => t.type === 'income' && t.clientId === client.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const numberOfVisits = clientVisits.length;
  const firstVisit = clientVisits[clientVisits.length - 1]?.date;
  const lastVisit = clientVisits[0]?.date;
  const totalSpent = clientTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full lg:w-1/2 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
            <p className="text-gray-600">View complete client information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {client.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{client.name}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Current Service: {client.service}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">£{totalSpent.toFixed(2)}</p>
                <p className="text-sm text-blue-600">Total Spent</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{numberOfVisits}</p>
                <p className="text-sm text-purple-600">Total Visits</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-900">
                  {firstVisit ? new Date(firstVisit).toLocaleDateString('en-GB') : 'N/A'}
                </p>
                <p className="text-sm text-green-600">First Visit</p>
              </div>
            </div>
          </section>

          {/* Visit History */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Visit History</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Service</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientVisits.length > 0 ? (
                    clientVisits.map((visit, index) => (
                      <tr key={`${visit.id}-${index}`}>
                        <td className="px-4 py-2 text-sm">
                          {new Date(visit.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {visit.service}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-sm font-semibold text-green-600">
                            £{clientTransactions.find(t => 
                              new Date(t.date).toDateString() === new Date(visit.date).toDateString()
                            )?.amount.toFixed(2) || '0.00'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center text-sm text-gray-500">No visit history</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}