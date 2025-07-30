
"use client"
import { useMemo, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

function TransactionItem({ transaction, index, showTypeIndicator }: { transaction: Transaction, index: number, showTypeIndicator: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const { expenseCategories, incomeCategories } = useApp();

    const getIconForCategory = (categoryName: string, type: 'income' | 'expense' | 'investment') => {
        const allCategories = type === 'income' ? incomeCategories : expenseCategories;
        const category = allCategories.find(c => c.label.toLowerCase() === categoryName.toLowerCase());
        return category?.icon || HelpCircle;
    }

    const Icon = getIconForCategory(transaction.category, transaction.type);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-transaction-in');
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div 
            ref={ref}
            key={transaction.id} 
            className="flex items-center justify-between p-3 rounded-xl bg-card text-card-foreground opacity-0"
            style={{ animationDelay: `${index * 50}ms`, willChange: 'transform, opacity' }}
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 bg-background rounded-full w-10 h-10">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="font-semibold text-sm">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">{transaction.description ? transaction.description : format(transaction.date, "p")}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {showTypeIndicator && (
                    transaction.type === 'income' ? 
                    <ArrowUpRight className="w-4 h-4 text-green-500" /> :
                    <ArrowDownLeft className="w-4 h-4 text-red-500" />
                )}
                <p className="font-semibold text-sm">{formatCurrency(transaction.amount)}</p>
            </div>
        </div>
    );
}


export function RecentTransactions({ transactions, showTypeIndicator, groupByDate = true }: { transactions: Transaction[], showTypeIndicator: boolean, groupByDate?: boolean }) {

    const groupedTransactions = useMemo(() => {
        if (!groupByDate) {
            return { 'transactions': transactions };
        }

        return transactions.reduce((acc, t) => {
            const dateKey = format(t.date, "EEEE, d MMM");
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(t);
            return acc;
        }, {} as Record<string, typeof transactions>);
    }, [transactions, groupByDate]);
    
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No transactions for this period.
            </div>
        )
    }

    if (!groupByDate) {
        return (
            <div className="space-y-2">
                {transactions.map((t, index) => (
                    <TransactionItem key={t.id} transaction={t} index={index} showTypeIndicator={showTypeIndicator} />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, trans]) => (
                <div key={date}>
                    <h3 className="text-sm text-muted-foreground mb-2">{date}</h3>
                    <div className="space-y-2">
                        {trans.map((t, index) => (
                           <TransactionItem key={t.id} transaction={t} index={index} showTypeIndicator={showTypeIndicator} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
