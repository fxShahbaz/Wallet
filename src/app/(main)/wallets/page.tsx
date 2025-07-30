
"use client";

import { useApp } from '@/context/app-context';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, PiggyBank } from 'lucide-react';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AccountCard } from '@/components/accounts/account-card';
import { Account } from '@/lib/types';
import { AnimatedCounter } from '@/components/dashboard/animated-counter';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function WalletsPage() {
    const { accounts } = useApp();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="flex flex-col h-full bg-secondary">
            <header className="flex items-center justify-between p-4 border-b h-14 shrink-0 bg-background">
               <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Wallets</h1>
               </div>
            </header>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4 pb-24">
                    <Card className="bg-gray-900 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>Total Balance</span>
                                <PiggyBank className="w-4 h-4" />
                            </div>
                            <div className="mt-1">
                                <AnimatedCounter value={totalBalance} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-muted-foreground px-1">Your Accounts</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {accounts.map((account, index) => (
                               <AccountCard key={account.id} account={account} index={index} />
                            ))}
                             <AddAccountSheet />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

    