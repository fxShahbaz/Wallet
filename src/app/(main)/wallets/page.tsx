
"use client";

import { useApp } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, PiggyBank } from 'lucide-react';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

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
                <div className="p-4 space-y-6 pb-32">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                            <PiggyBank className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-muted-foreground px-1">Your Accounts</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {accounts.map(account => (
                                <Card key={account.id} className="p-4 bg-card flex flex-col justify-between h-28">
                                    <div className="flex items-center gap-3">
                                        {account.icon && <div className="flex items-center justify-center p-2 bg-secondary rounded-full w-10 h-10 shrink-0"><account.icon className="w-5 h-5 text-muted-foreground" /></div>}
                                        <p className="font-semibold text-sm">{account.name}</p>
                                    </div>
                                    <div className="self-end">
                                      <p className="font-mono text-base font-semibold text-right">{formatCurrency(account.balance)}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    <AddAccountSheet />
                </div>
            </ScrollArea>
        </div>
    );
}
