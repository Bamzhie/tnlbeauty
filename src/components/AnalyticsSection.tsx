import React from "react";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { ExpenseBreakdownChart } from "./ExpenseBreakdownChart";
import { ServicesChart } from "./ServicesChart";
import { ExpenseData, ServiceCount } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsSectionProps {
  show: boolean;
  totalIncome: number;
  totalExpenses: number;
  pieData: ExpenseData[];
  serviceData: ServiceCount[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  show,
  totalIncome,
  totalExpenses,
  pieData,
  serviceData,
}) => {
  if (!show) return null;

  return (
    <Card className="mb-4 sm:mb-8 shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-900 text-base sm:text-lg">
          Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <IncomeExpenseChart
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
          <ExpenseBreakdownChart data={pieData} />
          <ServicesChart data={serviceData} />
        </div>
      </CardContent>
    </Card>
  );
};
