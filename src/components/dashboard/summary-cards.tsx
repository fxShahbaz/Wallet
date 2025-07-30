"use client"
import { useApp } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, DollarSign, PiggyBank } from 'lucide-react';
import { useMemo } from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export function SummaryCards() {
    const { accounts, transactions } = useApp();

    const summary = useMemo(() => {
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t => t.date >= startOfMonth);

        const totalIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, totalIncome, totalExpenses };
    }, [accounts, transactions]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <PiggyBank className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{formatCurrency(summary.totalBalance)}</div>
                    <p className="text-xs text-muted-foreground">Sum of all account balances</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline text-green-500">{formatCurrency(summary.totalIncome)}</div>
                    <p className="text-xs text-muted-foreground">Total income this month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
                    <ArrowDownLeft className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline text-red-500">{formatCurrency(summary.totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Total expenses this month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Net Balance (This Month)</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{formatCurrency(summary.totalIncome - summary.totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Income - Expenses</p>
                </CardContent>
            </Card>
        </div>
    );
}
