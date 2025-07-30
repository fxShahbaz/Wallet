export interface Account {
  id: string;
  name: string;
  initialBalance: number;
  balance: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  date: Date;
  category: string;
  description: string;
  accountId: string;
  toAccountId?: string;
  note?: string;
  payee?: string;
  paymentType?: string;
  status?: 'Cleared' | 'Uncleared' | 'Reconciled';
  location?: string;
  photo?: string;
  labels?: Label[];
}

export interface Category {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Label {
  id: string;
  name: string;
}
