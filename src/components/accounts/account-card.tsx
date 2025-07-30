
"use client"

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { EditAccountDialog } from '@/components/accounts/edit-account-dialog';
import { Account } from '@/lib/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export function AccountCard({ account, index }: { account: Account, index: number }) {
    const ref = useRef<HTMLDivElement>(null);

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
            className="opacity-0"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <EditAccountDialog account={account}>
                <Card className="p-3 bg-card flex flex-col justify-between h-24 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div>
                        <div className="flex items-center gap-2">
                            {account.icon && <div className="flex items-center justify-center p-1.5 bg-secondary rounded-full w-7 h-7 shrink-0"><account.icon className="w-3.5 h-3.5 text-muted-foreground" /></div>}
                            <p className="font-semibold text-xs">{account.name}</p>
                        </div>
                    </div>
                    <div className="self-end">
                        <p className="font-mono text-base font-semibold">{formatCurrency(account.balance)}</p>
                    </div>
                </Card>
            </EditAccountDialog>
        </div>
    )
}

