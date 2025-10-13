import { useState, useEffect, useMemo, useCallback } from 'react';
import { Client, Transaction, ClientDetail, ServiceCount, ExpenseData, Visit } from '../types';
import api, { AllDataResponse, AddIncomeDto, AddExpenseDto, AddIncomeToClientDto, Client as ApiClient, Transaction as ApiTransaction } from '../service/api';
import { MonthFilter } from '../components/MonthFilter';
import { ClientListTable } from '../components/ClientListTable';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { AddEntryModal } from '../components/AddEntryModal';
import { Sidebar } from '../components/Sidebar';
import { ClientDetails } from '../components/ClientDetails';
import { Toaster } from 'react-hot-toast';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';
import { ExpenseListTable } from '../components/ExpenseListTable';
import { Plus } from 'lucide-react';

// Adapter functions to convert API types to frontend types
const adaptApiClientToClient = (apiClient: ApiClient): Client => ({
  id: apiClient._id,
  name: apiClient.name,
  service: apiClient.service,
  date: apiClient.date,
  visitHistory: apiClient.visitHistory.map(visit => ({
    id: visit._id,
    date: visit.date,
    service: visit.service,
    amount: visit.amount,
  })),
});

const adaptApiTransactionToTransaction = (apiTransaction: ApiTransaction): Transaction => ({
  id: apiTransaction._id,
  clientId: apiTransaction.clientId || '',
  date: apiTransaction.date,
  type: apiTransaction.type,
  amount: apiTransaction.amount,
  category: apiTransaction.category || undefined,
  service: apiTransaction.service || undefined,
});

export default function ClientRevenueApp() {
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [apiClients, setApiClients] = useState<ApiClient[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | number>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState<'overview' | 'clients' | 'expenses' | 'analytics'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'choose' | 'income' | 'expense'>('choose');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AllDataResponse = await api.fetchAllData(
          selectedMonth !== 'all' ? Number(selectedMonth) : undefined,
          selectedYear
        );
        
        const adaptedClients = response.data.clients.map(adaptApiClientToClient);
        const adaptedTransactions = response.data.transactions.map(adaptApiTransactionToTransaction);
        
        setClients(adaptedClients);
        setTransactions(adaptedTransactions);
        setApiClients(response.data.clients);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

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

  const clientVisits = useMemo<Record<string, string[]>>(() => {
    const visits: Record<string, string[]> = {};
    monthClients.forEach(c => {
      const name = c.name.trim().toLowerCase();
      if (!visits[name]) visits[name] = [];
      visits[name].push(c.date);
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

  const recentTransactions = useMemo(() => {
    return [...monthTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, [monthTransactions]);

  const handleModalSubmit = useCallback(async (data: any) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      if (data.type === 'income') {
        const incomeDto: AddIncomeDto = {
          clientName: data.name.trim(),
          service: data.service,
          amount: Number(data.amount),
          date: data.date
        };
        const response = await api.addIncome(incomeDto);
        
        const adaptedClient = adaptApiClientToClient(response.client);
        const adaptedTransaction = adaptApiTransactionToTransaction(response.transaction);
        
        setClients(prev => {
          const clientExists = prev.find(c => c.id === adaptedClient.id);
          if (clientExists) {
            return prev.map(c => c.id === adaptedClient.id ? adaptedClient : c);
          }
          return [adaptedClient, ...prev];
        });
        setTransactions(prev => [adaptedTransaction, ...prev]);
        setApiClients(prev => [...prev, response.client]);
      } else if (data.type === 'expense') {
        const expenseDto: AddExpenseDto = {
          category: data.category,
          amount: Number(data.amount),
          date: data.date
        };
        const response = await api.addExpense(expenseDto);
        const adaptedTransaction = adaptApiTransactionToTransaction(response.transaction);
        setTransactions(prev => [adaptedTransaction, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting entry:', error);
      // Error toast is handled in AddEntryModal
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleAddEntry = useCallback(async (data: any) => {
    if (isSubmitting) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true);
      if (data.type === 'income' && selectedClient) {
        const apiClient = apiClients.find(c => c._id === selectedClient.id);
        if (apiClient) {
          const incomeDto: AddIncomeToClientDto = {
            service: data.service,
            amount: Number(data.amount),
            date: data.date
          };
          const response = await api.addIncomeToClient(apiClient._id, incomeDto);
          
          const adaptedClient = adaptApiClientToClient(response.client);
          const adaptedTransaction = adaptApiTransactionToTransaction(response.transaction);
          
          setClients(prev => prev.map(c => c.id === adaptedClient.id ? adaptedClient : c));
          setTransactions(prev => [adaptedTransaction, ...prev]);
          setApiClients(prev => prev.map(c => c._id === response.client._id ? response.client : c));
          setIsClientDetailsOpen(false);
        }
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      // Error toast is handled in AddEntryModal
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, selectedClient, apiClients]);

  const handleAddIncome = useCallback(() => {
    setModalStep('income');
    setSelectedClient(null);
    setIsModalOpen(true);
  }, []);

  const handleAddExpense = useCallback(() => {
    setModalStep('expense');
    setSelectedClient(null);
    setIsModalOpen(true);
  }, []);

  const handleClientClick = useCallback((clientDetail: ClientDetail) => {
    const client = clients.find(c => c.id === clientDetail.id);
    if (client) {
      setSelectedClient(client);
      setIsClientDetailsOpen(true);
    }
  }, [clients]);

  const handleCloseClientDetails = useCallback(() => {
    setIsClientDetailsOpen(false);
    setSelectedClient(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      );
    }

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
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-green-300">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Income</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-700">£{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-red-300">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-700">£{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-300">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Net Balance</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-700">£{balance.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-blue-300">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Clients</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-700">{monthClients.length}</p>
                </div>
              </div>

              {/* Analytics Overview and Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* Income vs Expenses Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      Income vs Expenses
                    </h3>
                  </div>
                  <div className="p-4 sm:px-6 sm:pt-6 sm:pb-4">
                    <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((tx) => {
                          const client = monthClients.find(c => c.id === tx.clientId);
                          const isIncome = tx.type === 'income';
                          const bgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
                          const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
                          
                          return (
                            <div
                              key={tx.id}
                              className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {isIncome && client ? `${client.name} - ${tx.service || client.service}` : tx.category || 'Transaction'}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className={`text-sm font-semibold ${amountColor} ml-4 flex-shrink-0`}>
                                £{tx.amount.toFixed(2)}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">No recent activities</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Activities will appear as you add transactions
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Desktop Only */}
              <div className="mb-6 sm:mb-8 hidden lg:block">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-blue-200 transition-colors"
                    onClick={() => {
                      setModalStep('choose');
                      setSelectedClient(null);
                      setIsModalOpen(true);
                    }}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">Add Entry</p>
                      <p className="text-xs sm:text-sm text-blue-600">Income or expense</p>
                    </div>
                  </button>
                  <button
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-green-200 transition-colors"
                    onClick={() => setCurrentPage('analytics')}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">View Analytics</p>
                      <p className="text-xs sm:text-sm text-green-600">See reports & insights</p>
                    </div>
                  </button>
                  <button
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-purple-200 transition-colors"
                    onClick={() => setCurrentPage('clients')}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">Manage Clients</p>
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
            {isClientDetailsOpen && (
              <div 
                className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out"
                onClick={handleCloseClientDetails}
              />
            )}
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clients</h1>
                <MonthFilter
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                  hideLabels={true}
                />
              </div>
              <ClientListTable 
                clients={clientDetails} 
                show={true} 
                onAddIncome={handleAddIncome}
                onClientClick={handleClientClick}
              />
            </div>
            <ClientDetails
              client={selectedClient}
              isOpen={isClientDetailsOpen}
              onClose={handleCloseClientDetails}
              transactions={transactions}
              allClients={clients}
              onAddEntry={handleAddEntry}
            />
          </main>
        );
      case 'expenses':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
                <MonthFilter
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                  hideLabels={true}
                />
              </div>
              <ExpenseListTable 
                expenses={expenseTransactions} 
                onAddExpense={handleAddExpense} 
              />
            </div>
          </main>
        );
      case 'analytics':
        return (
          <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
                <MonthFilter
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                  hideLabels={true}
                />
              </div>
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
        onAddClick={() => {
          setModalStep('choose');
          setSelectedClient(null);
          setIsModalOpen(true);
        }}
      />
      {renderContent()}
      <AddEntryModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleModalSubmit}
        initialStep={modalStep}
        initialClientName={selectedClient?.name || ''}
      />
      <Toaster position="top-right" />
    </div>
  );
}