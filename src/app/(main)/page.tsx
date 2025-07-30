

"use client";

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserNav } from '@/components/shared/user-nav';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { startOfDay, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatedCounter } from '@/components/dashboard/animated-counter';

const filters = ['Today', 'This week', 'This month'];

export default function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState(filters[0]);
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
            <div className="flex-1 flex flex-col">
                <div className="p-4 pt-0 space-y-4 sticky top-0 bg-secondary z-10">
                    <div className="relative flex items-center gap-2 bg-background p-1 rounded-full">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className="relative flex-1 py-1.5 text-sm font-medium text-center text-muted-foreground rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {activeFilter === filter && (
                                    <motion.span
                                        layoutId="active-filter-bubble"
                                        className="absolute inset-0 bg-primary"
                                        style={{ borderRadius: 9999 }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 mix-blend-exclusion">{filter}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col px-4">
                    <div className="pt-0 space-y-4">
                        <div className="p-4 rounded-2xl bg-gray-900 text-white">
                            <p className="text-sm text-gray-400">Spend so far</p>
                            <AnimatedCounter value={spendSoFar} />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 pt-4">
                        <RecentTransactions transactions={filteredTransactions} />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
