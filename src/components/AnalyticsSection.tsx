import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { IncomeExpenseChart } from './IncomeExpenseChart';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    labels: pieData.map(d => d.name),
    datasets: [
      {
        label: 'Expenses (£)',
        data: pieData.map(d => d.value),
        backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f59e0b'],
        borderColor: ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const serviceBarData = {
    labels: serviceData.map(d => d.service),
    datasets: [
      {
        label: 'Service Counts',
        data: serviceData.map(d => d.count),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
  };

  return (
    <div className="space-y-6">
      {/* Client Retention and Predictive Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Retention</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900">{retentionRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Days Between Visits</p>
              <p className="text-2xl font-bold text-gray-900">{averageDays} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Analysis</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Forecasted Income (Next Month)</p>
              <p className="text-2xl font-bold text-gray-900">£{forecastedIncome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Predicted Bookings (Next Month)</p>
              <p className="text-2xl font-bold text-gray-900">{predictedBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <Pie data={expensePieData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Services</h3>
          <Bar data={serviceBarData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}