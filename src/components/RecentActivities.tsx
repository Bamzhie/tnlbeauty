import { Client, Transaction } from '../types';

interface RecentActivitiesProps {
  transactions: Transaction[];
  clients: Client[];
}

export function RecentActivities({ transactions, clients }: RecentActivitiesProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {transactions.slice(0, 5).map((tx) => {
        const client = clients.find(c => c.id === tx.clientId);
        return (
          <div key={tx.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {tx.type === 'income' && client ? `${client.name} - ${client.service}` : tx.category || 'Transaction'}
            </p>
            <p className="text-sm text-gray-600">£{tx.amount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{tx.date}</p>
          </div>
        );
      })}
    </div>
  );
}