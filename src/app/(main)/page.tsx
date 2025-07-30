
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/shared/user-nav';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { startOfDay, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount);
};

export default function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState('Today');
    const { transactions } = useApp();

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        let interval;

        switch (activeFilter) {
            case 'This week':
                interval = { start: startOfWeek(now), end: now };
                break;
            case 'This month':
                interval = { start: startOfMonth(now), end: now };
                break;
            case 'Today':
            default:
                interval = { start: startOfDay(now), end: now };
                break;
        }

        return transactions.filter(t => isWithinInterval(t.date, interval));
    }, [transactions, activeFilter]);

    const spendSoFar = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="flex flex-col h-full bg-secondary text-foreground">
            <header className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserNav />
                        <div>
                            <p className="font-semibold text-xs">Good morning, Jon</p>
                            <p className="text-xs text-muted-foreground">Track your expenses, start your day right</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 p-4 pt-0 space-y-4 overflow-auto">
                <div className="flex items-center gap-2">
                    {['Today', 'This week', 'This month'].map((filter) => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? 'primary' : 'ghost'}
                            size="sm"
                            className="rounded-full shrink-0"
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
                <div className="p-4 rounded-2xl bg-gray-900 text-white">
                    <p className="text-sm text-gray-400">Spend so far</p>
                    <p className="text-2xl font-bold">{formatCurrency(spendSoFar)}</p>
                </div>
                <RecentTransactions transactions={filteredTransactions} />
            </div>
        </div>
    );
}
