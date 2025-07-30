"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Account, Transaction, Category } from '@/lib/types';
import { Landmark, PiggyBank, Wallet } from 'lucide-react';

// Sample data
const sampleAccounts: Account[] = [
  { id: '1', name: 'HDFC Bank', initialBalance: 50000, balance: 45300, icon: Landmark },
  { id: '2', name: 'SBI Bank', initialBalance: 75000, balance: 78500, icon: Landmark },
  { id: '3', name: 'Cash', initialBalance: 10000, balance: 8000, icon: Wallet },
  { id: '4', name: 'Savings', initialBalance: 200000, balance: 200000, icon: PiggyBank },
];

const sampleTransactions: Transaction[] = [
  { id: 't1', type: 'expense', amount: 1500, date: new Date('2024-07-20'), category: 'Groceries', description: 'Weekly grocery shopping', accountId: '1' },
  { id: 't2', type: 'income', amount: 5000, date: new Date('2024-07-18'), category: 'Salary', description: 'Part-time job payment', accountId: '2' },
  { id: 't3', type: 'expense', amount: 3200, date: new Date('2024-07-15'), category: 'Electronics', description: 'New headphones', accountId: '1' },
  { id: 't4', type: 'expense', amount: 2000, date: new Date('2024-07-12'), category: 'Bills', description: 'Electricity bill', accountId: '3' },
  { id: 't5', type: 'income', amount: 1500, date: new Date('2024-07-10'), category: 'Freelance', description: 'Logo design project', accountId: '2' },
];

const sampleCategories: Category[] = [
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Salary', label: 'Salary' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Bills', label: 'Bills' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Food', label: 'Food'},
    { value: 'Transportation', label: 'Transportation'},
    { value: 'Utilities', label: 'Utilities'},
  ];

// Context Type
interface AppContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addAccount: (account: Omit<Account, 'id' | 'balance'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);

  const addAccount = (accountData: Omit<Account, 'id' | 'balance'>) => {
    const newAccount: Account = {
      ...accountData,
      id: new Date().getTime().toString(),
      balance: accountData.initialBalance,
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: new Date().getTime().toString(),
    };

    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));

    // Update account balance
    setAccounts(prevAccounts =>
      prevAccounts.map(acc => {
        if (acc.id === newTransaction.accountId) {
          const newBalance = newTransaction.type === 'income'
            ? acc.balance + newTransaction.amount
            : acc.balance - newTransaction.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );
  };

  const value = {
    accounts,
    transactions,
    categories,
    addTransaction,
    addAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
