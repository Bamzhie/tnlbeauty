import React, { useCallback } from "react";
import { Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_COLORS } from "../utils";

interface ExpenseBreakdownChartProps {
  data: Array<{ name: string; value: number }>;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
  data,
}) => {
  const renderCustomLabel = useCallback((props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="10"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  }, []);

  const chartData = data as any[];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-blue-900 text-sm sm:text-base">
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 sm:h-72">
          <div className="flex h-full items-center gap-4">
            {/* Pie Chart Side */}
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomLabel as any}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EXPENSE_COLORS[entry.name] || "#a1a1aa"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend Side - Narrow container to force vertical layout */}
            <div className="w-24 flex-shrink-0">
              <div className="flex flex-col gap-2">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: EXPENSE_COLORS[entry.name] || "#a1a1aa" }}
                    ></span>
                    <span className="text-xs text-gray-700 whitespace-nowrap">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};