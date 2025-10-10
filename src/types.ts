export interface Client {
  id: string;
  name: string;
  service: string;
  date: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
}

export interface ClientDetail {
  id: string;
  name: string;
  service: string;
  amount: number;
}

export interface ServiceCount {
  service: string;
  count: number;
}

export interface ExpenseData {
  name: string;
  value: number;
}