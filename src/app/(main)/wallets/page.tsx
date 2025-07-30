
"use client";

import { useApp } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, PiggyBank } from 'lucide-react';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function WalletsPage() {
    const { accounts } = useApp();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b h-14 shrink-0">
               <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Wallets</h1>
               </div>
            </header>
            <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                        <PiggyBank className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold pt-4">{formatCurrency(totalBalance)}</p>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-muted-foreground">Your Accounts</h2>
                    {accounts.map(account => (
                        <Card key={account.id} className="flex items-center justify-between p-4">
                           <div className="flex items-center gap-4">
                                {account.icon && <account.icon className="w-6 h-6 text-muted-foreground" />}
                                <p className="font-semibold">{account.name}</p>
                           </div>
                           <p className="font-mono text-lg">{formatCurrency(account.balance)}</p>
                        </Card>
                    ))}
                </div>
                
                <AddAccountSheet />
            </div>
        </div>
    );
}
