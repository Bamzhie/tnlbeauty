import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";

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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 20 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151' }} 
          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
          tickLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151' }} 
          width={45}
          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
          tickLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
          <Cell fill="#16a34a" />
          <Cell fill="#dc2626" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};