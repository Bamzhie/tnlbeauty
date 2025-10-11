import { useState, useMemo, useCallback } from 'react';
import { Client, Transaction, ClientDetail, ServiceCount, ExpenseData } from '../types';
import { uid } from '../utils';
import { MonthFilter } from '../components/MonthFilter';
import { ClientListTable } from '../components/ClientListTable';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { AddEntryModal } from '../components/AddEntryModal';
import { RecentActivities } from '../components/RecentActivities';
import { Sidebar } from '../components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';
import { ExpenseListTable } from '../components/ExpenseListTable';
import { Plus } from 'lucide-react';

const sampleClients: Client[] = [
  { id: 'c1', name: 'Alice Johnson', service: 'Gel nails', date: '2025-10-01' },
  { id: 'c2', name: 'Maria Gomez', service: 'Waxing', date: '2025-09-30' },
];

const sampleTransactions: Transaction[] = [
  { id: 't1', clientId: 'c1', date: '2025-10-01', type: 'income', amount: 40 },
  { id: 't2', clientId: '', date: '2025-09-15', type: 'expense', amount: 10, category: 'Supplies' },
  { id: 't3', clientId: 'c2', date: '2025-09-30', type: 'income', amount: 30 },
  { id: 't4', clientId: '', date: '2025-10-05', type: 'expense', amount: 35, category: 'Rent' },
  { id: 't5', clientId: '', date: '2025-10-07', type: 'expense', amount: 20, category: 'Utilities' },
];

export default function ClientRevenueApp() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [selectedMonth, setSelectedMonth] = useState<string | number>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState<'overview' | 'clients' | 'expenses' | 'analytics'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (selectedMonth === 'all') return d.getFullYear() === Number(selectedYear);
      return d.getMonth() === Number(selectedMonth) && d.getFullYear() === Number(selectedYear);
    });
  }, [transactions, selectedMonth, selectedYear]);

  const monthClients = useMemo(() => {
    return clients.filter(c => {
      if (!c.date) return true;
      const d = new Date(c.date);
      if (selectedMonth === 'all') return d.getFullYear() === Number(selectedYear);
      return d.getMonth() === Number(selectedMonth) && d.getFullYear() === Number(selectedYear);
    });
  }, [clients, selectedMonth, selectedYear]);

  const incomeTransactions = useMemo(() => 
    monthTransactions.filter(t => t.type === 'income'), 
    [monthTransactions]
  );
  
  const expenseTransactions = useMemo(() => 
    monthTransactions.filter(t => t.type === 'expense'), 
    [monthTransactions]
  );

  const totalIncome = useMemo(() => 
    incomeTransactions.reduce((s, t) => s + Number(t.amount), 0), 
    [incomeTransactions]
  );
  
  const totalExpenses = useMemo(() => 
    expenseTransactions.reduce((s, t) => s + Number(t.amount), 0), 
    [expenseTransactions]
  );
  
  const balance = useMemo(() => 
    totalIncome - totalExpenses, 
    [totalIncome, totalExpenses]
  );

  const pieData = useMemo<ExpenseData[]>(() => {
    const grouped = expenseTransactions.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenseTransactions]);

  const serviceData = useMemo<ServiceCount[]>(() => {
    const counts = monthClients.reduce((acc, c) => { 
      acc[c.service] = (acc[c.service] || 0) + 1; 
      return acc; 
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([service, count]) => ({ service, count }));
  }, [monthClients]);

  const clientDetails = useMemo<ClientDetail[]>(() => {
    const byClient = incomeTransactions.reduce((acc, t) => {
      if (!t.clientId) return acc;
      acc[t.clientId] = (acc[t.clientId] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);
    return monthClients.map(client => ({
      id: client.id,
      name: client.name,
      service: client.service,
      amount: byClient[client.id] || 0,
      date: client.date,
    }));
  }, [monthClients, incomeTransactions]);

  // Client retention calculations
  const clientVisits = useMemo<Record<string, string[]>>(() => {
    const visits: Record<string, string[]> = {};
    monthClients.forEach(c => {
      if (!visits[c.name]) visits[c.name] = [];
      visits[c.name].push(c.date);
    });
    return visits;
  }, [monthClients]);

  const uniqueClients = Object.keys(clientVisits).length;
  const repeatClients = Object.values(clientVisits).filter(v => v.length > 1).length;
  const retentionRate = uniqueClients > 0 ? (repeatClients / uniqueClients * 100).toFixed(1) : '0';

  const averageDays = useMemo(() => {
    let totalAvg = 0;
    let numRepeat = 0;
    Object.values(clientVisits).forEach(visits => {
      if (visits.length > 1) {
        const sortedDates = visits.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
        let sumDiff = 0;
        for (let i = 1; i < sortedDates.length; i++) {
          sumDiff += (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
        }
        totalAvg += sumDiff / (sortedDates.length - 1);
        numRepeat++;
      }
    });
    return numRepeat > 0 ? (totalAvg / numRepeat).toFixed(1) : '0';
  }, [clientVisits]);

  // Predictive calculations
  const monthlyIncome = useMemo<Record<string, number>>(() => {
    const months: Record<string, number> = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      const monthKey = t.date.slice(0, 7);
      months[monthKey] = (months[monthKey] || 0) + Number(t.amount);
    });
    return months;
  }, [transactions]);

  const numMonths = Object.keys(monthlyIncome).length;
  const avgMonthlyIncome = numMonths > 0 ? Object.values(monthlyIncome).reduce((a, b) => a + b, 0) / numMonths : 0;
  const forecastedIncome = (avgMonthlyIncome * 1.05).toFixed(2);

  const monthlyBookings = useMemo<Record<string, number>>(() => {
    const months: Record<string, number> = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      const monthKey = t.date.slice(0, 7);
      months[monthKey] = (months[monthKey] || 0) + 1;
    });
    return months;
  }, [transactions]);

  const avgMonthlyBookings = numMonths > 0 ? Object.values(monthlyBookings).reduce((a, b) => a + b, 0) / numMonths : 0;
  const predictedBookings = Math.round(avgMonthlyBookings);

  // Recent activities
  const recentTransactions = useMemo(() => {
    return [...monthTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [monthTransactions]);

  const handleModalSubmit = useCallback((data: any) => {
    let clientId = '';

    if (data.type === 'income') {
      // Check if client exists
      const existingClient = clients.find(c => c.name.toLowerCase() === data.name.toLowerCase());
      
      if (existingClient) {
        clientId = existingClient.id;
        // Update existing client's last visit
        setClients(prev => prev.map(c => 
          c.id === clientId 
            ? { ...c, date: data.date, service: data.service }
            : c
        ));
      } else {
        // Create new client
        clientId = uid('c');
        const newClient: Client = { 
          id: clientId, 
          name: data.name, 
          service: data.service, 
          date: data.date
        };
        setClients(prev => [newClient, ...prev]);
      }
    }

    // Create transaction
    const tx: Transaction = {
      id: uid('t'),
      clientId,
      date: data.date,
      type: data.type,
      amount: Number(data.amount),
      category: data.type === 'expense' ? data.category : '',
    };

    setTransactions(prev => [tx, ...prev]);
    setIsModalOpen(false);
  }, [clients]);

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <header className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                  </div>
                  <MonthFilter
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                    hideLabels={true}
                  />
                </div>
              </header>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Income</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">£{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">£{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Net Balance</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">£{balance.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Clients</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{monthClients.length}</p>
                </div>
              </div>

              {/* Analytics Overview and Recent Activities */}
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="lg:flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
                </div>
                <div className="lg:flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <RecentActivities transactions={recentTransactions} clients={monthClients} />
                </div>
              </div>

              {/* Quick Actions - Desktop Only */}
              <div className="mb-6 sm:mb-8 hidden lg:block">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-blue-900">Add Entry</p>
                      <p className="text-xs sm:text-sm text-blue-600">Income or expense</p>
                    </div>
                  </button>
                  <button
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                    onClick={() => setCurrentPage('analytics')}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-green-900">View Analytics</p>
                      <p className="text-xs sm:text-sm text-green-600">See reports & insights</p>
                    </div>
                  </button>
                  <button
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                    onClick={() => setCurrentPage('clients')}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-purple-900">Manage Clients</p>
                      <p className="text-xs sm:text-sm text-purple-600">View & edit clients</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
      case 'clients':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Clients</h1>
              <ClientListTable clients={clientDetails} show={true} />
            </div>
          </main>
        );
      case 'expenses':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Expenses</h1>
              <ExpenseListTable expenses={expenseTransactions} />
            </div>
          </main>
        );
      case 'analytics':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Analytics</h1>
              <AnalyticsSection
                show={true}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                pieData={pieData}
                serviceData={serviceData}
                retentionRate={retentionRate}
                averageDays={averageDays}
                forecastedIncome={forecastedIncome}
                predictedBookings={predictedBookings}
              />
            </div>
          </main>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onAddClick={() => setIsModalOpen(true)}
      />
      {renderContent()}

      <AddEntryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <Toaster position="top-right" />
    </div>
  );
}