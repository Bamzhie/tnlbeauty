// src/components/ExpenseListTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '../types';

interface ExpenseListTableProps {
  expenses: Transaction[];
}

export const ExpenseListTable: React.FC<ExpenseListTableProps> = ({ expenses }) => {
  return (
    <Card className="mb-4 sm:mb-8 shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-900 text-base sm:text-lg">Expenses List</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Category</th>
                <th className="px-3 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-blue-50">
                  <td className="border px-3 py-2 text-center">{e.date}</td>
                  <td className="border px-3 py-2 text-center">{e.category}</td>
                  <td className="border px-3 py-2 text-center">£{e.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};