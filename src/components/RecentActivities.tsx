// New component: components/RecentActivities.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client, Transaction } from '../types';

interface RecentActivitiesProps {
  transactions: Transaction[];
  clients: Client[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ transactions, clients }) => {
  const getClientInfo = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.name} - ${client.service}` : '';
  };

  return (
    <Card className="mb-4 sm:mb-8 shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-900 text-base sm:text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Details</th>
                <th className="px-3 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50">
                  <td className="border px-3 py-2 text-center">{t.date}</td>
                  <td className="border px-3 py-2 text-center">{t.type}</td>
                  <td className="border px-3 py-2 text-center">
                    {t.type === 'income' ? getClientInfo(t.clientId) : t.category}
                  </td>
                  <td className="border px-3 py-2 text-center">£{t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};