import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Client,
  Transaction,
  ClientDetail,
  ServiceCount,
  ExpenseData,
} from "../types";
import api, {
  AllDataResponse,
  AddIncomeDto,
  AddExpenseDto,
  AddIncomeToClientDto,
  Client as ApiClient,
  Transaction as ApiTransaction,
} from "../service/api";
import { Filter } from "../components/Filter";
import { ClientListTable } from "../components/ClientListTable";
import { AddEntryModal } from "../components/AddEntryModal";
import { EditClientModal } from "../components/EditClientModal";
import { DeleteConfirmModal } from "../components/DeleteModalConfirm";
import { Sidebar } from "../components/Sidebar";
import { ClientDetails } from "../components/ClientDetails";
import { Toaster, toast } from "react-hot-toast";
import { IncomeExpenseChart } from "../components/IncomeExpenseChart";
import { ExpenseListTable } from "../components/ExpenseListTable";
import { Settings } from "../components/Settings";
import { Plus, Download } from "lucide-react";
import { AnalyticsSection } from "../components/AnalyticsSection";

// Simple linear regression function (used for other metrics)
const simpleRegression = (
  data: { x: number; y: number }[]
): { slope: number; intercept: number } => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0 };

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (const { x, y } of data) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
};

// Adapter functions to convert API types to frontend types
const adaptApiClientToClient = (apiClient: ApiClient): Client => ({
  id: apiClient._id,
  name: apiClient.name,
  service: apiClient.service,
  date: apiClient.date,
  visitHistory: apiClient.visitHistory.map((visit) => ({
    id: visit._id,
    visitId: visit.visitId,
    date: visit.date,
    service: visit.service,
    amount: visit.amount,
  })),
});

const adaptApiTransactionToTransaction = (
  apiTransaction: ApiTransaction
): Transaction => ({
  id: apiTransaction._id,
  clientId: apiTransaction.clientId || "",
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
  // Dashboard & Expenses State
  const [dashboardMonth, setDashboardMonth] = useState<string | number>("all");
  const [dashboardYear, setDashboardYear] = useState<number>(
    new Date().getFullYear()
  );

  // Analytics State
  const [analyticsYear, setAnalyticsYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState<
    "overview" | "clients" | "expenses" | "settings" | "analytics"
  >("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"choose" | "income" | "expense">(
    "choose"
  );
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientDetail | null>(null);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientDetail | null>(
    null
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newDarkMode;
    });
  }, []);

  // Reset state after clearing data
  const handleDataCleared = useCallback(() => {
    setClients([]);
    setTransactions([]);
    setApiClients([]);
    setSelectedClient(null);
    setIsClientDetailsOpen(false);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response: AllDataResponse;

        if (currentPage === "analytics") {
          // For analytics, fetch data for the selected year (all months)
          response = await api.fetchAllData(undefined, analyticsYear);
        } else if (currentPage === "clients") {
          // For clients, fetch ALL data (no filters)
          response = await api.fetchAllData();
        } else {
          // For dashboard, expenses, settings (uses dashboard filters)
          response = await api.fetchAllData(
            dashboardMonth !== "all" ? Number(dashboardMonth) : undefined,
            dashboardYear
          );
        }

        const adaptedClients = response.data.clients.map(
          adaptApiClientToClient
        );
        const adaptedTransactions = response.data.transactions.map(
          adaptApiTransactionToTransaction
        );

        setClients(adaptedClients);
        setTransactions(adaptedTransactions);
        setApiClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dashboardMonth, dashboardYear, analyticsYear, currentPage]);

  // Filtering Logic based on current page context
  const activeMonth =
    currentPage === "analytics" || currentPage === "clients"
      ? "all"
      : dashboardMonth;
  const activeYear =
    currentPage === "clients"
      ? undefined
      : currentPage === "analytics"
      ? analyticsYear
      : dashboardYear;

  const monthClients = useMemo(() => {
    // If we are in clients view, we want all clients sorted by date
    if (currentPage === "clients") {
      return [...clients].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    const filteredClients = clients.filter((c) => {
      if (activeMonth === "all")
        return activeYear
          ? new Date(c.date).getFullYear() === Number(activeYear)
          : true;
      return c.visitHistory.some((v) => {
        const d = new Date(v.date);
        return (
          d.getMonth() === Number(activeMonth) &&
          d.getFullYear() === Number(activeYear)
        );
      });
    });

    return filteredClients;
  }, [clients, activeMonth, activeYear, currentPage]);

  const monthTransactions = useMemo(() => {
    if (currentPage === "clients") {
      return transactions;
    }
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (activeMonth === "all")
        return activeYear ? d.getFullYear() === Number(activeYear) : true;
      return (
        d.getMonth() === Number(activeMonth) &&
        d.getFullYear() === Number(activeYear)
      );
    });
  }, [transactions, activeMonth, activeYear, currentPage]);

  const incomeTransactions = useMemo(
    () => monthTransactions.filter((t) => t.type === "income"),
    [monthTransactions]
  );

  const expenseTransactions = useMemo(
    () => monthTransactions.filter((t) => t.type === "expense"),
    [monthTransactions]
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((s, t) => s + Number(t.amount), 0),
    [incomeTransactions]
  );

  const totalExpenses = useMemo(
    () => expenseTransactions.reduce((s, t) => s + Number(t.amount), 0),
    [expenseTransactions]
  );

  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  const pieData = useMemo<ExpenseData[]>(() => {
    const grouped = expenseTransactions.reduce((acc, t) => {
      const cat = t.category || "Other";
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
    return Object.entries(counts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [monthClients]);

  const clientVisits = useMemo<Record<string, string[]>>(() => {
    const visits: Record<string, string[]> = {};
    monthClients.forEach((c) => {
      const name = c.name.trim().toLowerCase();
      if (!visits[name]) visits[name] = [];
      c.visitHistory.forEach((v) => {
        if (
          activeMonth === "all" ||
          new Date(v.date).getMonth() === Number(activeMonth)
        ) {
          visits[name].push(v.date);
        }
      });
    });
    return visits;
  }, [monthClients, activeMonth]);

  const retentionRate = useMemo(() => {
    const totalClients = Object.keys(clientVisits).length;
    const returningClients = Object.values(clientVisits).filter(
      (visits) => visits.length > 1
    ).length;

    return totalClients > 0
      ? ((returningClients / totalClients) * 100).toFixed(1)
      : "0.0";
  }, [clientVisits]);

  const averageDays = useMemo(() => {
    const visitIntervals: number[] = [];
    Object.values(clientVisits).forEach((visits) => {
      if (visits.length > 1) {
        const sortedDates = visits
          .map((d) => new Date(d))
          .sort((a, b) => a.getTime() - b.getTime());
        for (let i = 1; i < sortedDates.length; i++) {
          const daysDiff =
            (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) /
            (1000 * 60 * 60 * 24);
          visitIntervals.push(daysDiff);
        }
      }
    });
    if (visitIntervals.length === 0) return "0";
    const avg =
      visitIntervals.reduce((sum, val) => sum + val, 0) / visitIntervals.length;
    return avg < 1 ? (avg * 24).toFixed(1) + " hours" : avg.toFixed(1);
  }, [clientVisits]);

  const monthlyIncome = useMemo<Record<string, number>>(() => {
    const months: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        const monthKey = t.date.slice(0, 7);
        months[monthKey] = (months[monthKey] || 0) + Number(t.amount);
      });
    return months;
  }, [transactions]);

  const forecastedIncome = useMemo(() => {
    const incomeData = Object.entries(monthlyIncome).map(
      ([month, amount], index) => ({
        x: index,
        y: amount,
      })
    );
    if (incomeData.length < 2) return (totalIncome * 1.05).toFixed(2);
    const { slope, intercept } = simpleRegression(incomeData);
    const nextMonthIndex = incomeData.length;
    return (slope * nextMonthIndex + intercept).toFixed(2);
  }, [monthlyIncome, totalIncome]);

  const monthlyBookings = useMemo<Record<string, number>>(() => {
    const months: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        const monthKey = t.date.slice(0, 7);
        months[monthKey] = (months[monthKey] || 0) + 1;
      });
    return months;
  }, [transactions]);

  const predictedBookings = useMemo(() => {
    const bookingData = Object.entries(monthlyBookings).map(
      ([month, count], index) => ({
        x: index,
        y: count,
      })
    );
    if (bookingData.length < 2)
      return Math.round(
        incomeTransactions.length / (Object.keys(monthlyBookings).length || 1)
      );
    const { slope, intercept } = simpleRegression(bookingData);
    const nextMonthIndex = bookingData.length;
    return Math.max(Math.round(slope * nextMonthIndex + intercept), 0);
  }, [monthlyBookings, incomeTransactions]);

  const clientDetails = useMemo<ClientDetail[]>(() => {
    const byClient = incomeTransactions.reduce((acc, t) => {
      if (!t.clientId) return acc;
      acc[t.clientId] = (acc[t.clientId] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return monthClients.map((client) => ({
      id: client.id,
      name: client.name,
      service: client.service,
      amount: byClient[client.id] || 0,
      date: client.date,
      numberOfVisits: client.visitHistory.filter((v) => {
        const d = new Date(v.date);
        if (activeMonth === "all") {
          return activeYear ? d.getFullYear() === Number(activeYear) : true;
        }
        return (
          d.getMonth() === Number(activeMonth) &&
          d.getFullYear() === Number(activeYear)
        );
      }).length,
    }));
  }, [monthClients, incomeTransactions, activeMonth, activeYear]);

  const recentTransactions = useMemo(() => {
    return [...monthTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [monthTransactions]);

  const handleModalSubmit = useCallback(
    async (data: any) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        if (data.type === "income") {
          const incomeDto: AddIncomeDto = {
            clientName: data.name.trim(),
            service: data.service,
            amount: Number(data.amount),
            date: data.date,
          };
          const response = await api.addIncome(incomeDto);

          const adaptedClient = adaptApiClientToClient(response.client);
          const adaptedTransaction = adaptApiTransactionToTransaction(
            response.transaction
          );

          setClients((prev) => {
            const clientExists = prev.find((c) => c.id === adaptedClient.id);
            if (clientExists) {
              return prev.map((c) =>
                c.id === adaptedClient.id ? adaptedClient : c
              );
            }
            return [adaptedClient, ...prev];
          });
          setTransactions((prev) => [adaptedTransaction, ...prev]);
          setApiClients((prev) => [...prev, response.client]);
        } else if (data.type === "expense") {
          const expenseDto: AddExpenseDto = {
            category: data.category,
            amount: Number(data.amount),
            date: data.date,
          };
          const response = await api.addExpense(expenseDto);
          const adaptedTransaction = adaptApiTransactionToTransaction(
            response.transaction
          );
          setTransactions((prev) => [adaptedTransaction, ...prev]);
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting entry:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  const handleAddEntry = useCallback(
    async (data: any) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        if (data.type === "income" && selectedClient) {
          const apiClient = apiClients.find((c) => c._id === selectedClient.id);
          if (apiClient) {
            const incomeDto: AddIncomeToClientDto = {
              service: data.service,
              amount: Number(data.amount),
              date: data.date,
            };
            const response = await api.addIncomeToClient(
              apiClient._id,
              incomeDto
            );

            const adaptedClient = adaptApiClientToClient(response.client);
            const adaptedTransaction = adaptApiTransactionToTransaction(
              response.transaction
            );

            setClients((prev) =>
              prev.map((c) => (c.id === adaptedClient.id ? adaptedClient : c))
            );
            setTransactions((prev) => [adaptedTransaction, ...prev]);
            setApiClients((prev) =>
              prev.map((c) =>
                c._id === response.client._id ? response.client : c
              )
            );
            setSelectedClient(adaptedClient);
          }
        }
      } catch (error) {
        console.error("Error adding entry:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, selectedClient, apiClients]
  );

  const handleAddIncome = useCallback(() => {
    setModalStep("income");
    setSelectedClient(null);
    setIsModalOpen(true);
  }, []);

  const handleAddExpense = useCallback(() => {
    setModalStep("expense");
    setSelectedClient(null);
    setIsModalOpen(true);
  }, []);

  const handleClientClick = useCallback(
    (clientDetail: ClientDetail) => {
      const client = clients.find((c) => c.id === clientDetail.id);
      if (client) {
        setSelectedClient(client);
        setIsClientDetailsOpen(true);
      }
    },
    [clients]
  );

  const handleCloseClientDetails = useCallback(() => {
    setIsClientDetailsOpen(false);
    setSelectedClient(null);
  }, []);

  const handleEditClient = useCallback((client: ClientDetail) => {
    setClientToEdit(client);
    setIsEditClientOpen(true);
  }, []);

  const handleEditClientSubmit = useCallback(
    async (newName: string) => {
      if (!clientToEdit) return;

      try {
        const response = await api.updateClient(clientToEdit.id, {
          name: newName,
        });

        const adaptedClient = adaptApiClientToClient(response.client);

        setClients((prev) =>
          prev.map((c) => (c.id === adaptedClient.id ? adaptedClient : c))
        );

        setApiClients((prev) =>
          prev.map((c) => (c._id === response.client._id ? response.client : c))
        );

        if (selectedClient && selectedClient.id === adaptedClient.id) {
          setSelectedClient(adaptedClient);
        }

        setIsEditClientOpen(false);
        setClientToEdit(null);
      } catch (error) {
        console.error("Error updating client:", error);
        throw error;
      }
    },
    [clientToEdit, selectedClient]
  );

  const handleDeleteClient = useCallback((client: ClientDetail) => {
    setClientToDelete(client);
    setIsDeleteClientOpen(true);
  }, []);

  const handleDeleteClientConfirm = useCallback(async () => {
    if (!clientToDelete) return;

    try {
      await api.deleteClient(clientToDelete.id);

      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      setApiClients((prev) => prev.filter((c) => c._id !== clientToDelete.id));
      setTransactions((prev) =>
        prev.filter((t) => t.clientId !== clientToDelete.id)
      );

      if (selectedClient && selectedClient.id === clientToDelete.id) {
        setIsClientDetailsOpen(false);
        setSelectedClient(null);
      }

      toast.success("Client deleted successfully");
      setIsDeleteClientOpen(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
      throw error;
    }
  }, [clientToDelete, selectedClient]);

  const handleEditVisit = useCallback(
    async (visitId: string, service: string, amount: number) => {
      if (!selectedClient) return;

      try {
        const response = await api.updateClient(selectedClient.id, {
          visitId,
          newService: service,
          newAmount: amount,
        });

        const adaptedClient = adaptApiClientToClient(response.client);

        setClients((prev) =>
          prev.map((c) => (c.id === adaptedClient.id ? adaptedClient : c))
        );

        setApiClients((prev) =>
          prev.map((c) => (c._id === response.client._id ? response.client : c))
        );

        setSelectedClient(adaptedClient);

        if (response.updatedTransaction) {
          const adaptedTransaction = adaptApiTransactionToTransaction(
            response.updatedTransaction
          );
          setTransactions((prev) =>
            prev.map((t) =>
              t.id === adaptedTransaction.id ? adaptedTransaction : t
            )
          );
        }
      } catch (error) {
        console.error("Error editing visit:", error);
        throw error;
      }
    },
    [selectedClient]
  );

  // report download
  const downloadDashboardReport = () => {
    const headers = [
      "Type",
      "Amount",
      "Date",
      "Category/Service",
      "Client Name",
    ];

    const incomeData = incomeTransactions.map((tx) => {
      const client = monthClients.find((c) => c.id === tx.clientId);
      return [
        "Income",
        `£${tx.amount.toFixed(2)}`,
        new Date(tx.date).toLocaleDateString("en-GB"),
        tx.service || client?.service || "N/A",
        client?.name || "N/A",
      ];
    });

    const expenseData = expenseTransactions.map((tx) => [
      "Expense",
      `£${tx.amount.toFixed(2)}`,
      new Date(tx.date).toLocaleDateString("en-GB"),
      tx.category || "Uncategorized",
      "N/A",
    ]);

    const incomeSection = [["INCOME TRANSACTIONS"], ...incomeData];
    const expenseSection = [[], ["EXPENSE TRANSACTIONS"], ...expenseData];
    const summary = [
      [],
      ["SUMMARY"],
      [`Total Income,£${totalIncome.toFixed(2)}`],
      [`Total Expenses,£${totalExpenses.toFixed(2)}`],
      [`Net Balance,£${balance.toFixed(2)}`],
      [`Total Clients,${monthClients.length}`],
      [
        `Period,${
          dashboardMonth === "all" ? "All Months" : `Month ${dashboardMonth}`
        } ${dashboardYear}`,
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...incomeSection.map((row) =>
        Array.isArray(row) ? row.map((field) => `"${field}"`).join(",") : row
      ),
      ...expenseSection.map((row) =>
        Array.isArray(row) ? row.map((field) => `"${field}"`).join(",") : row
      ),
      ...summary.flat().map((row) => row),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `income_expense_report_${dashboardYear}${
        dashboardMonth === "all" ? "" : `_${dashboardMonth}`
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </main>
      );
    }

    switch (currentPage) {
      case "overview":
        return (
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <header className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      Dashboard
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <Filter
                      selectedMonth={dashboardMonth}
                      selectedYear={dashboardYear}
                      onMonthChange={setDashboardMonth}
                      onYearChange={setDashboardYear}
                    />
                  </div>
                </div>
              </header>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-green-300 dark:border-green-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Total Income
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-400">
                    £{totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-red-300 dark:border-red-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Total Expenses
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-700 dark:text-red-400">
                    £{totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Net Balance
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-200">
                    £{balance.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-300 dark:border-blue-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Total Clients
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {monthClients.length}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                      Income vs Expenses
                    </h3>
                  </div>
                  <div className="flex-1 p-4 sm:p-6 min-h-[300px] sm:min-h-[350px]">
                    <IncomeExpenseChart
                      totalIncome={totalIncome}
                      totalExpenses={totalExpenses}
                    />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((tx) => {
                          const client = monthClients.find(
                            (c) => c.id === tx.clientId
                          );
                          const isIncome = tx.type === "income";
                          const bgColor = isIncome
                            ? "bg-green-50 dark:bg-green-900/50"
                            : "bg-red-50 dark:bg-red-900/50";
                          const amountColor = isIncome
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400";
                          return (
                            <div
                              key={tx.id}
                              className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {isIncome && client
                                    ? `${client.name} - ${
                                        tx.service || client.service
                                      }`
                                    : tx.category || "Transaction"}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(tx.date).toLocaleDateString(
                                    "en-GB",
                                    { day: "numeric", month: "short" }
                                  )}
                                </span>
                              </div>
                              <p
                                className={`text-sm font-semibold ${amountColor} ml-4 flex-shrink-0`}
                              >
                                £{tx.amount.toFixed(2)}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                              className="w-6 h-6 text-gray-400 dark:text-gray-300"
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
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No recent activities
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                            Activities will appear as you add transactions
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <button
                    className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600 transition-colors"
                    onClick={() => {
                      setModalStep("choose");
                      setSelectedClient(null);
                      setIsModalOpen(true);
                    }}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-400 dark:bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                        Add Entry
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 hidden sm:block">
                        Income or expense
                      </p>
                    </div>
                  </button>
                  <button
                    className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-green-200 dark:border-green-600 transition-colors"
                    onClick={() => setCurrentPage("analytics")}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-400 dark:bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                        View Analytics
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 hidden sm:block">
                        See reports & insights
                      </p>
                    </div>
                  </button>
                  <button
                    className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-purple-200 dark:border-purple-600 transition-colors"
                    onClick={() => setCurrentPage("clients")}
                    disabled={isSubmitting}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-400 dark:bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                        Manage Clients
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 hidden sm:block">
                        View & edit clients
                      </p>
                    </div>
                  </button>
                  <button
                    className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-600 transition-colors"
                    onClick={downloadDashboardReport}
                    disabled={
                      isSubmitting ||
                      (incomeTransactions.length === 0 &&
                        expenseTransactions.length === 0)
                    }
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-400 dark:bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                        Download Report
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 hidden sm:block">
                        Income & Expenses
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
      case "clients":
        return (
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56">
            {isClientDetailsOpen && (
              <div
                className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity duration-300 ease-in-out"
                onClick={handleCloseClientDetails}
              />
            )}
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Clients
                </h1>
                <div className="flex items-center gap-4">
                  {/* No filter for clients page */}
                </div>
              </div>
              <ClientListTable
                clients={clientDetails}
                show={true}
                onAddIncome={handleAddIncome}
                onClientClick={handleClientClick}
                onEditClient={handleEditClient}
                onDeleteClient={handleDeleteClient}
              />
            </div>
            {isClientDetailsOpen && (
              <ClientDetails
                client={selectedClient}
                isOpen={isClientDetailsOpen}
                onClose={handleCloseClientDetails}
                transactions={monthTransactions}
                allClients={monthClients}
                onAddEntry={handleAddEntry}
                onEditVisit={handleEditVisit}
              />
            )}
          </main>
        );
      case "expenses":
        return (
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Expenses
                </h1>
                <div className="flex items-center gap-4">
                  <Filter
                    selectedMonth={dashboardMonth}
                    selectedYear={dashboardYear}
                    onMonthChange={setDashboardMonth}
                    onYearChange={setDashboardYear}
                  />
                </div>
              </div>
              <ExpenseListTable
                expenses={expenseTransactions}
                onAddExpense={handleAddExpense}
              />
            </div>
          </main>
        );
      case "settings":
        return (
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <div className="flex items-center gap-4">
                  <Filter
                    selectedMonth={dashboardMonth}
                    selectedYear={dashboardYear}
                    onMonthChange={setDashboardMonth}
                    onYearChange={setDashboardYear}
                  />
                </div>
              </div>
              <Settings
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                onDataCleared={handleDataCleared}
              />
            </div>
          </main>
        );
      case "analytics":
        return (
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen lg:ml-56">
            <div className="pt-4 pb-20 lg:pb-8 lg:pt-8 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics
                </h1>
                <div className="flex items-center gap-4">
                  <Filter
                    selectedYear={analyticsYear}
                    onYearChange={setAnalyticsYear}
                    showMonth={false}
                  />
                </div>
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAddClick={() => {
          setModalStep("choose");
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
        initialClientName={selectedClient?.name || ""}
      />
      <EditClientModal
        isOpen={isEditClientOpen}
        onClose={() => {
          setIsEditClientOpen(false);
          setClientToEdit(null);
        }}
        onSubmit={handleEditClientSubmit}
        clientName={clientToEdit?.name || ""}
      />
      <DeleteConfirmModal
        isOpen={isDeleteClientOpen}
        onClose={() => {
          setIsDeleteClientOpen(false);
          setClientToDelete(null);
        }}
        onConfirm={handleDeleteClientConfirm}
        clientName={clientToDelete?.name || ""}
      />
      <Toaster position="top-right" />
    </div>
  );
}
