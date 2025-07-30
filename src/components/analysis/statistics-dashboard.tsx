
"use client";
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account, Transaction } from '@/lib/types';
import {
  BarChart,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Receipt,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
  isToday,
  differenceInDays,
  startOfDay,
  format,
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
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
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
    const today = startOfDay(now);

    // Time Ranges
    const thisMonthInterval = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
    const lastMonthInterval = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    // Filter transactions
    const todaysTransactions = transactions.filter((t) => isToday(t.date));
    const thisMonthTransactions = transactions.filter((t) =>
      isWithinInterval(t.date, thisMonthInterval)
    );
    const lastMonthTransactions = transactions.filter((t) =>
      isWithinInterval(t.date, lastMonthInterval)
    );
    
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

    const totalExpenseThisMonth = thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenseLastMonth = lastMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenseAllTime = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const dailyAvgSpent = totalExpenseAllTime / daysSinceFirstTransaction;

    const incomeThisMonth = thisMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashFlowThisMonth = incomeThisMonth - totalExpenseThisMonth;

    const incomeLastMonth = lastMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashFlowLastMonth = incomeLastMonth - totalExpenseLastMonth;

    return {
      currentBalance,
      dailyAvgSpent,
      overallToday,
      todaysExpense,
      totalExpenseThisMonth,
      totalExpenseLastMonth,
      cashFlowThisMonth,
      cashFlowLastMonth,
    };
  }, [accounts, transactions]);

  const stats = [
    {
      title: 'Current Balance',
      value: formatCurrency(summary.currentBalance),
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: 'Daily Avg. Spent',
      value: formatCurrency(summary.dailyAvgSpent),
      icon: <TrendingDown className="h-5 w-5" />,
    },
    {
      title: 'Overall Today',
      value: formatCurrency(summary.overallToday),
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Today's Expense",
      value: formatCurrency(summary.todaysExpense),
      icon: <Wallet className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
