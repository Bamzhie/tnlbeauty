import { useState, useMemo, useCallback } from 'react';
import { Client, Transaction, ClientDetail, ServiceCount, ExpenseData } from '../types';
import { uid } from '../utils';
import { MonthFilter } from '../components/MonthFilter';
import { ClientCounter } from '../components/ClientCounter';
import { ClientListTable } from '../components/ClientListTable';
import { OverviewCards } from '../components/OverviewCards';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { AddEntryForm } from '../components/AddEntryForm';

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
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [customService, setCustomService] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  
  const [formName, setFormName] = useState('');
  const [formService, setFormService] = useState('');
  const [formCustomService, setFormCustomService] = useState('');
  const [formCategory, setFormCategory] = useState('Supplies');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');

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
    }));
  }, [monthClients, incomeTransactions]);

  const handleAdd = useCallback(() => {
    let clientId = '';

    if (txType === 'income') {
      const name = formName.trim();
      if (!name) { alert('Client name required'); return; }
      let service = formService;
      if (service === 'Other') { service = formCustomService.trim() || 'Other'; }
      if (!service) { alert('Please select a service'); return; }
      clientId = uid('c');
      const newClient: Client = { 
        id: clientId, 
        name, 
        service, 
        date: formDate || new Date().toISOString().slice(0, 10) 
      };
      setClients(prev => [newClient, ...prev]);
    }

    const tx: Transaction = {
      id: uid('t'),
      clientId,
      date: formDate || new Date().toISOString().slice(0, 10),
      type: txType,
      amount: Number(formAmount) || 0,
      category: txType === 'expense' ? formCategory : '',
    };

    setTransactions(prev => [tx, ...prev]);
    
    setFormName('');
    setFormService('');
    setFormCustomService('');
    setFormCategory('Supplies');
    setFormAmount('');
    setFormDate('');
    setCustomService('');
  }, [txType, formName, formService, formCustomService, formCategory, formAmount, formDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-3 sm:p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-blue-900">
        Money Tracker
      </h1>

      <MonthFilter
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      <ClientCounter
        count={monthClients.length}
        selectedMonth={selectedMonth}
        showClientList={showClientList}
        onToggle={() => setShowClientList(!showClientList)}
      />

      <ClientListTable clients={clientDetails} show={showClientList} />

      <OverviewCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
      />

      <AnalyticsSection
        show={showAnalytics}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        pieData={pieData}
        serviceData={serviceData}
      />

      <AddEntryForm
        txType={txType}
        formName={formName}
        formService={formService}
        formCustomService={formCustomService}
        formCategory={formCategory}
        formAmount={formAmount}
        formDate={formDate}
        customService={customService}
        onTxTypeChange={setTxType}
        onFormNameChange={setFormName}
        onFormServiceChange={setFormService}
        onFormCustomServiceChange={setFormCustomService}
        onFormCategoryChange={setFormCategory}
        onFormAmountChange={setFormAmount}
        onFormDateChange={setFormDate}
        onCustomServiceChange={setCustomService}
        onSubmit={handleAdd}
      />
    </div>
  );
}