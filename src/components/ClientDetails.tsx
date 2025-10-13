import { X, Calendar, TrendingUp } from 'lucide-react';
import { Client, Transaction } from '../types';
import { AddEntryModal } from './AddEntryModal';
import { useState, useEffect } from 'react';

interface ClientDetailsProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  allClients: Client[];
  onAddEntry: (data: any) => void;
}

export function ClientDetails({ client, isOpen, onClose, transactions, allClients, onAddEntry }: ClientDetailsProps) {
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  // Reset isAddEntryOpen when client changes or component unmounts
  useEffect(() => {
    return () => {
      setIsAddEntryOpen(false);
    };
  }, [client]);

  // Log render details
  useEffect(() => {
    if (client) {
      console.log('ClientDetails rendered, client:', client, 'isOpen:', isOpen);
      console.log('Footer should render with Add New Entry and Close buttons');
    } else {
      console.log('ClientDetails not rendered: client is null');
    }
  }, [client, isOpen]);

  if (!client) {
    return null; // Render nothing but still call all hooks
  }

  // Use visitHistory from client
  const clientVisits = client.visitHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Use transactions for consistency with other components, filtered by clientId
  const clientTransactions = transactions
    .filter(t => t.type === 'income' && t.clientId === client.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const numberOfVisits = clientVisits.length;
  const firstVisit = clientVisits[clientVisits.length - 1]?.date;
  const lastVisit = clientVisits[0]?.date;
  const totalSpent = clientVisits.reduce((sum, visit) => sum + visit.amount, 0);

  return (
    <>
      <div className={`fixed inset-y-0 right-0 z-50 w-full lg:w-1/2 h-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Client Details</h2>
              <p className="text-gray-600 dark:text-gray-400">View complete client information</p>
            </div>
            <button
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {client.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{client.name}</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Current Service: {client.service}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <section className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">£{totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Spent</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{numberOfVisits}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Total Visits</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">
                    {firstVisit ? new Date(firstVisit).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">First Visit</p>
                </div>
              </div>
            </section>

            {/* Visit History */}
            <section className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Visit History</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Service</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {clientVisits.length > 0 ? (
                      clientVisits.map((visit) => (
                        <tr key={visit.id}>
                          <td className="px-4 py-2 text-sm dark:text-gray-300">
                            {new Date(visit.date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                            {visit.service}
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              £{visit.amount.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">No visit history</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 z-50 min-h-[80px] w-full">
            <button
              data-testid="add-new-entry-button"
              onClick={() => {
                console.log('Add New Entry button clicked, opening AddEntryModal with initialStep=income');
                setIsAddEntryOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all font-semibold text-base shadow-md min-w-[140px] min-h-[48px] visible"
            >
              Add New Entry
            </button>
            <button
              data-testid="close-button"
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
              className="px-6 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-semibold text-base min-w-[100px] min-h-[48px] visible"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isAddEntryOpen}
        onClose={() => {
          console.log('AddEntryModal closed');
          setIsAddEntryOpen(false);
        }}
        onSubmit={(data) => {
          console.log('AddEntryModal submitted:', data);
          onAddEntry(data);
          setIsAddEntryOpen(false);
        }}
        initialStep="income"
        initialClientName={client.name}
      />
    </>
  );
}