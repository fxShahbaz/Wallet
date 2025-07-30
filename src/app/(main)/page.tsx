
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/shared/user-nav';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useApp } from '@/context/app-context';
import { Calendar } from 'lucide-react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount);
};

export default function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState('Today');
    const { transactions } = useApp();

    const spendSoFar = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="flex flex-col h-full bg-secondary text-foreground">
            <header className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserNav />
                        <div>
                            <p className="font-semibold text-sm">Good morning, Jon</p>
                            <p className="text-xs text-muted-foreground">Track your expenses, start your day right</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 p-4 pt-0 space-y-4 overflow-auto">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
                    {['Today', 'This week', 'This month', 'This Year', 'All Time'].map((filter) => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? 'primary' : 'secondary'}
                            size="sm"
                            className="rounded-full shrink-0"
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                    <Button variant="secondary" size="sm" className="rounded-full shrink-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        Calendar
                    </Button>
                </div>
                <div className="p-4 rounded-2xl bg-card text-card-foreground">
                    <p className="text-sm text-muted-foreground">Spend so far</p>
                    <p className="text-2xl font-bold">{formatCurrency(spendSoFar)}</p>
                </div>
                <RecentTransactions />
            </div>
        </div>
    );
}
