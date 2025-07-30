
"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { Account, Transaction, Category, User } from '@/lib/types';
import { Landmark, PiggyBank, Wallet, ShoppingBag, Utensils, Car, Home, Dumbbell, Briefcase, Gift, HeartHandshake, Film, BookOpen, Truck, Fuel, Wrench, Shirt, ShoppingCart, Drama, HandCoins, Repeat, HelpCircle, UserRound, ArrowRightLeft, CircleDollarSign, PlusCircle, Ban, Laptop, Pencil, Beer as BeerLucide, Bike } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper components for icons not in lucide-react
const Apple = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 12.062C14 11.028 14.733 10.203 15.66 10.025C15.766 10.009 15.858 9.927 15.875 9.82C16.053 8.749 16.924 8 18 8C19.105 8 20 8.895 20 10C20 11.105 19.105 12 18 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.5 5.5C14.833 3.667 12.6 1 8.5 1 5.5 1 2.5 4.5 2.5 8.5C2.5 13.5 6.5 16 8.5 22C10.5 16 12 13.625 12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Beer = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 21L12 3M8 21H4L3 12H13L12 3M8 21V12M12 3H21L20 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Sample data
const sampleAccounts: Account[] = [
  { id: '1', name: 'HDFC Bank', initialBalance: 50000, balance: 45300, icon: Landmark },
  { id: '2', name: 'SBI Bank', initialBalance: 75000, balance: 78500, icon: Landmark },
  { id: '3', name: 'Cash', initialBalance: 10000, balance: 8000, icon: Wallet },
  { id: '4', name: 'Savings', initialBalance: 200000, balance: 200000, icon: PiggyBank },
];

const today = new Date();
const sampleTransactions: Transaction[] = [
    { id: 't1', type: 'expense', amount: 2500, date: new Date(new Date().setHours(9, 15, 0, 0)), category: 'Food', description: 'Suya and garri', accountId: '1' },
    { id: 't2', type: 'expense', amount: 5300, date: new Date(new Date().setHours(10, 30, 0, 0)), category: 'Transportation', description: 'Bolt fee', accountId: '2' },
    { id: 't3', type: 'expense', amount: 25000, date: new Date(new Date().setHours(14, 0, 0, 0)), category: 'Shopping', description: 'Lumber Jacket', accountId: '1' },
    { id: 't4', type: 'expense', amount: 1800, date: new Date(new Date().setDate(today.getDate() - 1)), category: 'Transportation', description: 'Uber', accountId: '3' },
    { id: 't5', type: 'income', amount: 1500, date: new Date(new Date().setDate(today.getDate() - 2)), category: 'Freelance', description: 'Logo design project', accountId: '2' },
    { id: 't6', type: 'income', amount: 85000, date: new Date(new Date(today).setDate(1)), category: 'Salary', description: 'Monthly Salary', accountId: '1' },
    { id: 't7', type: 'income', amount: 12000, date: new Date(new Date().setDate(today.getDate() - 5)), category: 'Freelance', description: 'Web design gig', accountId: '2' },
    { id: 't8', type: 'income', amount: 500, date: new Date(new Date().setDate(today.getDate() - 3)), category: 'Refund', description: 'Amazon return', accountId: '1' },

];

const initialExpenseCategories: Category[] = [
    { value: 'food', label: 'Food', icon: Utensils, budget: 15000 },
    { value: 'groceries', label: 'Groceries', icon: ShoppingCart, budget: 10000 },
    { value: 'fruits_or_vegetables', label: 'Fruits or Vegetables', icon: Apple },
    { value: 'home', label: 'Home', icon: Home },
    { value: 'personal_care', label: 'Personal Care', icon: HeartHandshake },
    { value: 'electronics_accessories', label: 'Electronics & Accessories', icon: Laptop },
    { value: 'utilities', label: 'Utilities', icon: Wrench, budget: 7500 },
    { value: 'learning', label: 'Learning', icon: BookOpen },
    { value: 'entertainment', label: 'Entertainment', icon: Film, budget: 5000 },
    { value: 'private', label: 'Private', icon: UserRound },
    { value: 'travelling', label: 'Travelling', icon: Truck },
    { value: 'bar_cafe_drinks', label: 'Bar, Cafe & Drinks', icon: BeerLucide },
    { value: 'shopping', label: 'Shopping', icon: Shirt, budget: 20000 },
    { value: 'money_lending', label: 'Money Lending', icon: HandCoins },
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'fuel', label: 'Fuel', icon: Fuel },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench },
    { value: 'health_fitness', label: 'Health & Fitness', icon: Dumbbell },
    { value: 'bike_maintenance', label: 'Bike Maintenance', icon: Wrench },
    { value: 'transportation', label: 'Transportation', icon: Car, budget: 6000 },
    { value: 'unknown', label: 'Unknown', icon: HelpCircle },
    { value: 'unwanted', label: 'Unwanted', icon: Ban },
];

const incomeCategories: Category[] = [
    { value: 'salary', label: 'Salary', icon: Briefcase },
    { value: 'freelance', label: 'Freelance', icon: Pencil },
    { value: 'refund', label: 'Refund', icon: Repeat },
    { value: 'investment', label: 'Investment', icon: CircleDollarSign },
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'fuel', label: 'Fuel', icon: Fuel },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench },
    { value: 'health_fitness', label: 'Health & Fitness', icon: Dumbbell },
    { value: 'bike_maintenance', label: 'Bike Maintenance', icon: Wrench },
    { value: 'unknown', label: 'Unknown', icon: HelpCircle },
    { value: 'unwanted', label: 'Unwanted', icon: Ban },
];


// Context Type
interface AppContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  accounts: Account[];
  transactions: Transaction[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addAccount: (account: Omit<Account, 'id' | 'balance' | 'icon'>) => void;
  editAccount: (updatedAccount: Pick<Account, 'id' | 'name' | 'initialBalance'>) => void;
  deleteAccount: (accountId: string) => void;
  setCategoryBudget: (categoryValue: string, budget: number) => void;
  clearAllData: () => void;
  submitTransactionForm: boolean;
  setSubmitTransactionForm: Dispatch<SetStateAction<boolean>>;
  transactionType: 'income' | 'expense' | 'investment';
  setTransactionType: Dispatch<SetStateAction<'income' | 'expense' | 'investment'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [submitTransactionForm, setSubmitTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'investment'>('expense');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setAccounts(sampleAccounts);
      setTransactions(sampleTransactions);
      setExpenseCategories(initialExpenseCategories);
      // set a default user
      setUser({ name: 'User', email: 'user@example.com' });
    }, 500); // 0.5 second delay

    return () => clearTimeout(timer);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

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

  const setCategoryBudget = (categoryValue: string, budget: number) => {
    setExpenseCategories(prev => 
        prev.map(cat => 
            cat.value === categoryValue ? { ...cat, budget } : cat
        )
    );
    toast({
        title: "Budget Updated",
        description: `Budget for ${categoryValue} set to ${budget}.`,
    });
  }


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
    user,
    login,
    logout,
    accounts,
    transactions,
    expenseCategories,
    incomeCategories,
    addTransaction,
    addAccount,
    editAccount,
    deleteAccount,
    setCategoryBudget,
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
