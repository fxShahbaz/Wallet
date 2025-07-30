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
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const filters = ['Today', 'This week', 'This month'];
const transactionFilters = {
    all: 'All Transactions',
    expense: 'Expenses',
    income: 'Income'
};


export default function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState(filters[0]);
    const { transactions } = useApp();
    const [greeting, setGreeting] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [transactionFilter, setTransactionFilter] = useState<keyof typeof transactionFilters>('all');

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

        return transactions
          .filter(t => isWithinInterval(t.date, interval))
          .filter(t => {
            if (transactionFilter === 'all') return true;
            return t.type === transactionFilter;
          });
    }, [transactions, activeFilter, isClient, transactionFilter]);

    const { cardTitle, cardValue } = useMemo(() => {
      let title = "Spend so far";
      let value = 0;

      const income = filteredTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      switch (transactionFilter) {
        case 'income':
          title = 'Income so far';
          value = income;
          break;
        case 'expense':
          title = 'Spend so far';
          value = expense;
          break;
        case 'all':
        default:
          title = 'Net so far';
          value = income - expense;
          break;
      }

      return { cardTitle: title, cardValue: value };
    }, [filteredTransactions, transactionFilter]);

    return (
        <div className="flex flex-col h-full bg-secondary text-foreground">
            <header className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserNav />
                        <div>
                            <p className="font-semibold text-xs">{greeting}, Shahbaz</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent focus-visible:ring-0">
                                        <span>{transactionFilters[transactionFilter]}</span>
                                        <ChevronDown className="w-3 h-3 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setTransactionFilter('all')}>All Transactions</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTransactionFilter('expense')}>Expenses</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTransactionFilter('income')}>Income</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col">
                <div className="sticky top-0 z-10 p-4 pt-0">
                        <div className="relative flex items-center gap-2 p-1 rounded-full">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={cn(
                                        "relative flex-1 py-1.5 text-sm font-medium text-center text-muted-foreground rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    )}
                                >
                                    {activeFilter === filter && (
                                        <motion.span
                                            layoutId="active-filter-bubble"
                                            className="absolute inset-0 bg-primary"
                                            style={{ borderRadius: 9999 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={cn("relative z-10", activeFilter === filter && "text-primary-foreground")}>{filter}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                <div className="flex-1 flex flex-col relative">
                    
                    <div className="p-4 pt-0 space-y-4">
                        <div className="p-4 rounded-2xl bg-gray-900 text-white">
                            <p className="text-sm text-gray-400">{cardTitle}</p>
                            <AnimatedCounter value={cardValue} />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <ScrollArea className="flex-1 px-4">
                            <RecentTransactions transactions={filteredTransactions} showTypeIndicator={transactionFilter === 'all'} />
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
