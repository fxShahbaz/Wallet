export interface Account {
  id: string;
  name: string;
  initialBalance: number;
  balance: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'lended' | 'receivable' | 'investment';
  amount: number;
  date: Date;
  category: string;
  description: string;
  accountId: string;
  toAccountId?: string;
}

export interface Category {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}
