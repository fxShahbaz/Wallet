"use client"
import { useApp } from '@/context/app-context';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ShoppingBag } from 'lucide-react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
        case 'suya and garri':
        case 'food':
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 12H17M7 16H17" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M4 6H20L18.5 22H5.5L4 6Z" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.556 6C15.556 3.79086 13.7651 2 11.556 2C9.34686 2 7.55598 3.79086 7.55598 6" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        case 'lumber jacket':
        case 'shopping':
             return <ShoppingBag className="w-6 h-6" />;
        case 'bolt fee':
        case 'uber':
        case 'transportation':
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.333 11.1667H4.66667C3.9303 11.1667 3.33333 11.7636 3.33333 12.5V18.3333C3.33333 19.0697 3.9303 19.6667 4.66667 19.6667H19.3333C20.0697 19.6667 20.6667 19.0697 20.6667 18.3333V12.5C20.6667 11.7636 20.0697 11.1667 19.333 11.1667Z" stroke="#1C274C" strokeWidth="1.5"/>
                    <path d="M17 19.5V21.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 19.5V21.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.5 15H2" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 15H20.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6.33337H8C6.15905 6.33337 4.66667 4.84099 4.66667 3.00004C4.66667 2.84978 4.6789 2.69953 4.70337 2.5531M16 6.33337C17.841 6.33337 19.3333 7.82576 19.3333 9.66671V11.1667H16V6.33337Z" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        default:
            return <div className="w-6 h-6 bg-gray-300 rounded-md" />;
    }
}


export function RecentTransactions() {
    const { transactions } = useApp();

    const groupedTransactions = useMemo(() => {
        return transactions.reduce((acc, t) => {
            const dateKey = format(t.date, "EEEE, d MMM");
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(t);
            return acc;
        }, {} as Record<string, typeof transactions>);
    }, [transactions]);

    return (
        <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, trans]) => (
                <div key={date}>
                    <h3 className="text-sm text-muted-foreground mb-2">{date}</h3>
                    <div className="space-y-2">
                        {trans.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-card text-card-foreground">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-secondary rounded-full">
                                        {getIconForCategory(t.category)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <p className="text-xs text-muted-foreground">{format(t.date, "p")}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">{formatCurrency(t.amount)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
