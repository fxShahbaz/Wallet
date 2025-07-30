
"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { Account, Transaction, Category } from '@/lib/types';
import { Landmark, PiggyBank, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data
const sampleAccounts: Account[] = [
  { id: '1', name: 'HDFC Bank', initialBalance: 50000, balance: 45300, icon: Landmark },
  { id: '2', name: 'SBI Bank', initialBalance: 75000, balance: 78500, icon: Landmark },
  { id: '3', name: 'Cash', initialBalance: 10000, balance: 8000, icon: Wallet },
  { id: '4', name: 'Savings', initialBalance: 200000, balance: 200000, icon: PiggyBank },
];

const today = new Date();
const sampleTransactions: Transaction[] = [
    { id: 't1', type: 'expense', amount: 2500, date: new Date(new Date().setHours(9, 15, 0, 0)), category: 'Suya and garri', description: 'Suya and garri', accountId: '1' },
    { id: 't2', type: 'expense', amount: 5300, date: new Date(new Date().setHours(10, 30, 0, 0)), category: 'Bolt fee', description: 'Bolt fee', accountId: '2' },
    { id: 't3', type: 'expense', amount: 25000, date: new Date(new Date().setHours(14, 0, 0, 0)), category: 'Lumber Jacket', description: 'Lumber Jacket', accountId: '1' },
    { id: 't4', type: 'expense', amount: 1800, date: new Date(new Date().setDate(today.getDate() - 1)), category: 'Uber', description: 'Uber', accountId: '3' },
    { id: 't5', type: 'income', amount: 1500, date: new Date(new Date().setDate(today.getDate() - 2)), category: 'Freelance', description: 'Logo design project', accountId: '2' },
    { id: 't6', type: 'income', amount: 85000, date: new Date(new Date(today).setDate(1)), category: 'Salary', description: 'Monthly Salary', accountId: '1' },
    { id: 't7', type: 'income', amount: 12000, date: new Date(new Date().setDate(today.getDate() - 5)), category: 'Freelance', description: 'Web design gig', accountId: '2' },
    { id: 't8', type: 'income', amount: 500, date: new Date(new Date().setDate(today.getDate() - 3)), category: 'Refund', description: 'Amazon return', accountId: '1' },

];

const expenseCategories: Category[] = [
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Fruits or Vegetables', label: 'Fruits or Vegetables' },
    { value: 'Home', label: 'Home' },
    { value: 'Personal Care', label: 'Personal Care' },
    { value: 'Electronics & Accessories', label: 'Electronics & Accessories' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Learning', label: 'Learning' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Private', label: 'Private' },
    { value: 'Travelling', label: 'Travelling' },
    { value: 'Bar, Cafe & Drinks', label: 'Bar, Cafe & Drinks' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Money Lending', label: 'Money Lending' },
    { value: 'Unknown', label: 'Unknown' },
    { value: 'Unwanted', label: 'Unwanted' },
    { value: 'Bike', label: 'Bike' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Health & Fitness', label: 'Health & Fitness' },
    { value: 'Bike Maintenance', label: 'Bike Maintenance' },
    { value: 'Food', label: 'Food'},
    { value: 'Transportation', label: 'Transportation'},
];

const incomeCategories: Category[] = [
    { value: 'Salary', label: 'Salary' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Refund', label: 'Refund' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Unknown', label: 'Unknown' },
    { value: 'Unwanted', label: 'Unwanted' },
    { value: 'Bike', label: 'Bike' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Health & Fitness', label: 'Health & Fitness' },
    { value: 'Bike Maintenance', label: 'Bike Maintenance' },
];

// Context Type
interface AppContextType {
  accounts: Account[];
  transactions: Transaction[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addAccount: (account: Omit<Account, 'id' | 'balance' | 'icon'>) => void;
  editAccount: (updatedAccount: Pick<Account, 'id' | 'name' | 'initialBalance'>) => void;
  deleteAccount: (accountId: string) => void;
  clearAllData: () => void;
  submitTransactionForm: boolean;
  setSubmitTransactionForm: Dispatch<SetStateAction<boolean>>;
  transactionType: 'income' | 'expense' | 'investment';
  setTransactionType: Dispatch<SetStateAction<'income' | 'expense' | 'investment'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [submitTransactionForm, setSubmitTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'investment'>('expense');
  const { toast } = useToast();

  const addAccount = (accountData: Omit<Account, 'id' | 'balance' | 'icon'>) => {
    const newAccount: Account = {
      ...accountData,
      id: new Date().getTime().toString(),
      balance: accountData.initialBalance,
      icon: Landmark,
    };
    setAccounts(prev => [...prev, newAccount]);
    toast({
        title: "Account Added",
        description: `${newAccount.name} has been successfully added.`,
    });
  };

  const editAccount = (updatedAccount: Pick<Account, 'id' | 'name' | 'initialBalance'>) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => {
        if (account.id === updatedAccount.id) {
          const balanceDifference = updatedAccount.initialBalance - account.initialBalance;
          return {
            ...account,
            name: updatedAccount.name,
            initialBalance: updatedAccount.initialBalance,
            balance: account.balance + balanceDifference
          };
        }
        return account;
      })
    );
     toast({
        title: "Account Updated",
        description: `Your account has been successfully updated.`,
    });
  };

  const deleteAccount = (accountId: string) => {
    // Note: This is a simple delete. In a real app, you'd want to handle
    // what happens to transactions associated with this account.
    setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
    setTransactions(prevTransactions => prevTransactions.filter(t => t.accountId !== accountId));
     toast({
        title: "Account Deleted",
        description: `Your account has been permanently deleted.`,
        variant: 'destructive'
    });
  };
  
  const clearAllData = () => {
    setAccounts([]);
    setTransactions([]);
     toast({
        title: "Data Cleared",
        description: "All your data has been successfully deleted.",
        variant: 'destructive'
    });
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
          let newBalance;
          if (newTransaction.type === 'income') {
            newBalance = acc.balance + newTransaction.amount;
          } else { // 'expense' or 'investment'
            newBalance = acc.balance - newTransaction.amount;
          }
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );
  };

  const value = {
    accounts,
    transactions,
    expenseCategories,
    incomeCategories,
    addTransaction,
    addAccount,
    editAccount,
    deleteAccount,
    clearAllData,
    submitTransactionForm,
    setSubmitTransactionForm,
    transactionType,
    setTransactionType,
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
