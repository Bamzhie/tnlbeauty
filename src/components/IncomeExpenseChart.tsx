import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IncomeExpenseChartProps {
  totalIncome: number;
  totalExpenses: number;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  totalIncome,
  totalExpenses,
}) => {
  const data = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardContent>
        <div className="h-56 sm:h-60 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 20 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                axisLine={true}
                tickLine={true}
              />
              <YAxis tick={{ fontSize: 11 }} width={45} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};