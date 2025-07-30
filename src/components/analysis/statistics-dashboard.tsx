
"use client";
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account, Transaction } from '@/lib/types';
import {
  BarChart,
  Wallet,
  TrendingDown,
} from 'lucide-react';
import {
  isToday,
  differenceInDays,
  startOfDay,
  format
} from 'date-fns';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function StatisticsDashboard({
  accounts,
  transactions,
}: {
  accounts: Account[];
  transactions: Transaction[];
}) {
  const summary = useMemo(() => {
    const now = new Date();

    // Filter transactions
    const todaysTransactions = transactions.filter((t) => isToday(t.date));
    
    const firstTransactionDate = transactions.length > 0
        ? transactions.reduce((min, t) => t.date < min ? t.date : min, new Date())
        : new Date();

    const daysSinceFirstTransaction = differenceInDays(now, firstTransactionDate) + 1;


    // Calculations
    const currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const todaysExpense = todaysTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const todaysIncome = todaysTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const overallToday = todaysIncome - todaysExpense;
      
    const totalExpenseAllTime = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => t.amount, 0);

    const dailyAvgSpent = totalExpenseAllTime / daysSinceFirstTransaction;

    return {
      currentBalance,
      dailyAvgSpent,
      overallToday,
      todaysExpense,
    };
  }, [accounts, transactions]);

  const stats = [
    {
      title: 'Current Balance',
      value: formatCurrency(summary.currentBalance),
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: 'Daily Avg. Spent',
      value: formatCurrency(summary.dailyAvgSpent),
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      title: 'Overall Today',
      value: formatCurrency(summary.overallToday),
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Today's Expense",
      value: formatCurrency(summary.todaysExpense),
      icon: <Wallet className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
