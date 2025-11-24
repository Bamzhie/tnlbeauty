import axios from "axios";

const API_BASE_URL =
  import.meta.env.PROD
    ? 'https://api.tnlbeauty.com'
    : 'http://localhost:3000';

// DTO Interfaces
export interface AddIncomeDto {
  clientName: string;
  service: string;
  amount: number;
  date?: string;
}

export interface AddExpenseDto {
  category: string;
  amount: number;
  date?: string;
}


export interface AddIncomeToClientDto {
  service: string;
  amount: number;
  date?: string;
}

export interface UpdateClientDto {
  name?: string;
  visitId?: string;
  newService?: string;
  newAmount?: number;
}

// Response Interfaces
export interface AllDataResponse {
  success: boolean;
  message: string;
  data: {
    clients: Client[];
    transactions: Transaction[];
    expenses: Expense[];
  };
}

export interface AddIncomeResponse {
  success: boolean;
  message: string;
  client: Client;
  transaction: Transaction;
}

export interface AddExpenseResponse {
  success: boolean;
  message: string;
  expense: Expense;
  transaction: Transaction;
}

export interface AddIncomeToClientResponse {
  success: boolean;
  message: string;
  client: Client;
  transaction: Transaction;
  visitCount: number;
  totalSpent: number;
}

export interface UpdateClientResponse {
  success: boolean;
  message: string;
  client: Client;
  updatedTransaction?: Transaction;
}

export interface DeleteClientResponse {
  success: boolean;
  message: string;
  deletedClientId: string;
  deletedTransactionsCount: number;
}

// Entity Interfaces
export interface Client {
  _id: string;
  name: string;
  service: string;
  date: string;
  visitHistory: VisitHistory[];
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VisitHistory {
  date: string;
  service: string;
  amount: number;
  _id: string;
  visitId: string;
}

export interface Transaction {
  _id: string;
  clientId: string | null;
  clientName: string | null;
  type: 'income' | 'expense';
  amount: number;
  service: string | null;
  category: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Expense {
  _id: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ResetDatabaseResponse {
  success: boolean;
  message: string;
  data: {
    clientsDeleted: number;
    transactionsDeleted: number;
    expensesDeleted: number;
  };
}

// API Functions
const api = {
  fetchAllData: async (month?: number, year?: number): Promise<AllDataResponse> => {
    const params: { month?: number; year?: number } = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    const response = await axios.get(`${API_BASE_URL}/tracker/all`, { params });
    return response.data;
  },

  addIncome: async (dto: AddIncomeDto): Promise<AddIncomeResponse> => {
    const response = await axios.post(`${API_BASE_URL}/tracker/income`, dto);
    return response.data;
  },

  addExpense: async (dto: AddExpenseDto): Promise<AddExpenseResponse> => {
    const response = await axios.post(`${API_BASE_URL}/tracker/expense`, dto);
    return response.data;
  },

  addIncomeToClient: async (id: string, dto: AddIncomeToClientDto): Promise<AddIncomeToClientResponse> => {
    const response = await axios.patch(`${API_BASE_URL}/tracker/clients/${id}/income`, dto);
    return response.data;
  },

  updateClient: async (id: string, dto: UpdateClientDto): Promise<UpdateClientResponse> => {
    const response = await axios.patch(`${API_BASE_URL}/tracker/clients/${id}`, dto);
    return response.data;
  },

  deleteClient: async (id: string): Promise<DeleteClientResponse> => {
    const response = await axios.delete(`${API_BASE_URL}/tracker/clients/${id}`);
    return response.data;
  },

  resetDatabase: async (): Promise<ResetDatabaseResponse> => {
    const response = await axios.delete(`${API_BASE_URL}/tracker/reset`);
    return response.data;
  },
};

export default api;