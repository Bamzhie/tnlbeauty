import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { ServicesChart } from "./ServicesChart";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsSectionProps {
  show: boolean;
  totalIncome: number;
  totalExpenses: number;
  pieData: { name: string; value: number }[];
  serviceData: { service: string; count: number }[];
  retentionRate: string;
  averageDays: string;
  forecastedIncome: string;
  predictedBookings: number;
}

export function AnalyticsSection({
  show,
  totalIncome,
  totalExpenses,
  pieData,
  serviceData,
  retentionRate,
  averageDays,
  forecastedIncome,
  predictedBookings,
}: AnalyticsSectionProps) {
  if (!show) return null;

  const expensePieData = {
    labels: pieData.map((d) => d.name),
    datasets: [
      {
        label: "Expenses (£)",
        data: pieData.map((d) => d.value),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#22c55e",
          "#a855f7",
          "#f59e0b",
        ],
        borderColor: [
          "#2563eb",
          "#dc2626",
          "#16a34a",
          "#9333ea",
          "#d97706",
        ],
        borderWidth: 1,
      },
    ],
  };

  const serviceBarData = {
    labels: serviceData.map((d) => d.service),
    datasets: [
      {
        label: "Service Counts",
        data: serviceData.map((d) => d.count),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  // Options for PIE CHART (no scales!)
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 40,
        right: 40,
      },
    },
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          color: "#374151", // gray-700
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827", // gray-900
        bodyColor: "#111827", // gray-900
        borderColor: "#d1d5db", // gray-300
        borderWidth: 1,
      },
    },
  };

  const darkPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 40,
        right: 40,
      },
    },
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          color: "#d1d5db", // gray-300
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1f2937", // gray-800
        titleColor: "#ffffff", // white
        bodyColor: "#ffffff", // white
        borderColor: "#4b5563", // gray-600
        borderWidth: 1,
      },
    },
  };

  // Options for BAR CHART (with scales)
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          color: "#374151", // gray-700
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827", // gray-900
        bodyColor: "#111827", // gray-900
        borderColor: "#d1d5db", // gray-300
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151", // gray-700
        },
        grid: {
          color: "#e5e7eb", // gray-200
        },
      },
      y: {
        ticks: {
          color: "#374151", // gray-700
        },
        grid: {
          color: "#e5e7eb", // gray-200
        },
      },
    },
  };

  const darkBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          color: "#d1d5db", // gray-300
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1f2937", // gray-800
        titleColor: "#ffffff", // white
        bodyColor: "#ffffff", // white
        borderColor: "#4b5563", // gray-600
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d1d5db", // gray-300
        },
        grid: {
          color: "#4b5563", // gray-600
        },
      },
      y: {
        ticks: {
          color: "#d1d5db", // gray-300
        },
        grid: {
          color: "#4b5563", // gray-600
        },
      },
    },
  };

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-6">
      {/* Client Retention and Predictive Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Client Retention
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {retentionRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Avg Days Between Visits
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageDays}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Predictive Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Forecasted Income (Next Month)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                £{forecastedIncome}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Predicted Bookings (Next Month)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {predictedBookings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expense
          </h3>
          <div className="h-56 sm:h-72">
            <IncomeExpenseChart
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown
          </h3>
          <div className="h-56 sm:h-72">
            <Pie data={expensePieData} options={isDark ? darkPieChartOptions : pieChartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Common Services
          </h3>
          <div className="h-56 sm:h-72">
            <ServicesChart data={serviceData} />
          </div>
        </div>
      </div>
    </div>
  );
}