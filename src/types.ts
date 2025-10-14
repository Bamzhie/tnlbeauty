export interface Client {
  id: string;
  name: string;
  service: string;
  date: string;
  visitHistory: Visit[]; // Add visitHistory
}

export interface Visit {
  id: string;
  date: string;
  service: string;
  amount: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  service?: string; // Add service
}

export interface ClientDetail {
  id: string;
  name: string;
  service: string;
  amount: number;
  date: string;
  numberOfVisits?: number; 
}

export interface ServiceCount {
  service: string;
  count: number;
}

export interface ExpenseData {
  name: string;
  value: number;
}