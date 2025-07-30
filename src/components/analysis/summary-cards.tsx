
"use client"
import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const SummaryCard = ({ title, value, icon, colorClass, dark }: { title: string, value: number, icon: React.ReactNode, colorClass?: string, dark?: boolean }) => {
    if (value === 0) return null;

    const [titlePart1, titlePart2] = title.split(' ');

    return (
        <Card className={cn("bg-gray-900 text-white flex flex-col justify-between h-32", dark && "bg-gray-900 text-white")}>
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    {titlePart1}
                    {titlePart2 && <br />}
                    {titlePart2}
                </CardTitle>
                <div className={cn("w-5 h-5", colorClass)}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", colorClass)}>{formatCurrency(value)}</div>
            </CardContent>
        </Card>
    )
};

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
    const summary = useMemo(() => {
        return transactions.reduce((acc, t) => {
            switch(t.type) {
                case 'income':
                    acc.income += t.amount;
                    break;
                case 'expense':
                    acc.expense += t.amount;
                    break;
                case 'investment':
                    acc.investment += t.amount;
                    break;
            }
            return acc;
        }, {
            income: 0,
            expense: 0,
            investment: 0
        });
    }, [transactions]);
    
    const hasSummaryData = Object.values(summary).some(val => val > 0);

    if (!hasSummaryData) {
        return (
            <div className="text-center text-muted-foreground py-8">
                <p>No summary data available for the selected period.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <SummaryCard title="Total Income" value={summary.income} icon={<ArrowUpRight />} colorClass="text-green-500" dark />
                <SummaryCard title="Total Expenses" value={summary.expense} icon={<ArrowDownLeft />} colorClass="text-red-500" dark />
            </div>
             <div className="grid gap-4 md:grid-cols-2">
                <SummaryCard title="Total Investment" value={summary.investment} icon={<TrendingUp />} />
            </div>
        </div>
    );
}
