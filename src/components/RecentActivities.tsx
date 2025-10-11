import { Client, Transaction } from '../types';

interface RecentActivitiesProps {
  transactions: Transaction[];
  clients: Client[];
}

export function RecentActivities({ transactions, clients }: RecentActivitiesProps) {
  return (
     <div className="grid grid-cols-1 gap-4">
      {transactions.slice(0, 4).map((tx) => {
        const client = clients.find(c => c.id === tx.clientId);
        const isIncome = tx.type === 'income';
        const bgColor = isIncome ? '#FAFAFA' : '#FAFAFA';
        const borderColor = isIncome ? '#E5E7EB' : '#E5E7EB';
        const titleColor = isIncome ? 'text-gray-700' : 'text-gray-700';
        const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
        const dateColor = isIncome ? 'text-gray-500' : 'text-gray-500';

        return (
          <div
            key={tx.id}
            className={`p-4 rounded-lg border`}
            style={{ backgroundColor: bgColor, borderColor: borderColor }}
          >
            <p className={`text-sm font-medium ${titleColor}`}>
              {isIncome && client ? `${client.name} - ${client.service}` : tx.category || 'Transaction'}
            </p>
            <p className={`text-sm ${amountColor}`}>£{tx.amount.toFixed(2)}</p>
            <p className={`text-xs ${dateColor}`}>{tx.date}</p>
          </div>
        );
      })}
    </div>
  );
}