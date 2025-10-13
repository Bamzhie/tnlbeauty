import axios from "axios";

const API_BASE_URL = 'https://tnlbeauty-api.onrender.com'; 

// DTO Interfaces (similar to reference)
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


};

export default api;
