"use client"
import { useApp } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export function RecentTransactions() {
    const { transactions, accounts } = useApp();

    const recentTransactions = useMemo(() => {
        return transactions.slice(0, 10).map(t => ({
            ...t,
            accountName: accounts.find(a => a.id === t.accountId)?.name || 'N/A'
        }));
    }, [transactions, accounts]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your 10 most recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[40px] sm:table-cell">Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden md:table-cell">Account</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted">
                                    {t.type === 'income' ? 
                                        <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
                                        <ArrowDownLeft className="w-4 h-4 text-red-500" />
                                    }
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{t.description}</div>
                                    <div className="text-sm text-muted-foreground">{t.date.toLocaleDateString()}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="outline">{t.category}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{t.accountName}</TableCell>
                                <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
