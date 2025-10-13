import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ServiceCount } from "../types";

interface ServicesChartProps {
  data: ServiceCount[];
}

export const ServicesChart: React.FC<ServicesChartProps> = ({ data }) => {
  // Limit to top 4 services
  const limitedData = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={limitedData} 
        margin={{ top: 10, right: 10, bottom: 30, left: 20 }}
      >
        <XAxis
          dataKey="service"
          tick={{ fontSize: 12, fill: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151' }}
          angle={-45}
          textAnchor="end"
          height={60}
          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
          tickLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151' }}
          width={45}
          allowDecimals={false}
          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
          tickLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb' }}
        />
        <Bar 
          dataKey="count" 
          fill="#3b82f6" 
          radius={[6, 6, 0, 0]} 
          barSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};