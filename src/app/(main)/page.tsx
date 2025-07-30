

"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/shared/user-nav';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { startOfDay, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatedCounter } from '@/components/dashboard/animated-counter';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};

export default function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState('Today');
    const { transactions } = useApp();
    const [greeting, setGreeting] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      const hour = new Date().getHours();
      if (hour < 12) {
          setGreeting('Good morning');
      } else if (hour < 18) {
          setGreeting('Good afternoon');
      } else {
          setGreeting('Good evening');
      }
    }, []);

    const filteredTransactions = useMemo(() => {
        if (!isClient) return [];

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
    }, [transactions, activeFilter, isClient]);

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
                            <p className="font-semibold text-xs">{greeting}, Shahbaz</p>
                            <p className="text-xs text-muted-foreground">Track your expenses.</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="p-4 pt-0 space-y-4">
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
                    <AnimatedCounter value={spendSoFar} />
                </div>
            </div>
            <ScrollArea className="flex-1 px-4">
                <RecentTransactions transactions={filteredTransactions} />
            </ScrollArea>
        </div>
    );
}
