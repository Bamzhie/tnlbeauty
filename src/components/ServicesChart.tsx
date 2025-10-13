import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
          axisLine={true}
          tickLine={true}
        />
        <YAxis 
          tick={{ fontSize: 11 }} 
          width={45}
          allowDecimals={false} 
        />
        <Tooltip />
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