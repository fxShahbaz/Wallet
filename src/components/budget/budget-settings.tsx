
"use client"

import { useState, useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category, Transaction } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

function SetBudgetDialog({ category, children }: { category: Category, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(category.budget || 0);
    const { setCategoryBudget } = useApp();

    const handleSave = () => {
        setCategoryBudget(category.value, amount);
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Budget for {category.label}</DialogTitle>
                    <DialogDescription>
                        Enter the monthly budget amount for this category.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="budget-amount">Budget Amount</Label>
                    <Input
                        id="budget-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="e.g., 5000"
                        className="mt-2"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save Budget</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function BudgetSettings({ transactions }: { transactions: Transaction[] }) {
    const { expenseCategories } = useApp();

    const spentData = useMemo(() => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
    
        const monthlyExpenses = transactions.filter(
          (t) => t.type === 'expense' && t.date >= start && t.date <= end
        );
    
        return monthlyExpenses.reduce((acc, t) => {
            if (!acc[t.category]) {
                acc[t.category] = 0;
            }
            acc[t.category] += t.amount;
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground px-1">Category Budgets (Current Month)</h2>
            <div className="bg-card rounded-xl border">
                {expenseCategories.map((category, index) => {
                     const Icon = category.icon || HelpCircle;
                     const spent = spentData[category.label] || 0;
                     const budget = category.budget || 0;
                     const progress = budget > 0 ? (spent / budget) * 100 : 0;
                     const isOverBudget = spent > budget;

                    return (
                        <div key={category.value} className={`p-3 ${index < expenseCategories.length - 1 ? 'border-b' : ''}`}>
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center p-2 bg-background rounded-full w-9 h-9">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium">{category.label}</p>
                                </div>
                                <SetBudgetDialog category={category}>
                                    <Button variant="outline" size="sm">Set Budget</Button>
                                </SetBudgetDialog>
                            </div>
                            
                            {budget > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                       <span className={cn("font-medium", isOverBudget ? 'text-destructive' : 'text-muted-foreground')}>
                                         {formatCurrency(spent)}
                                       </span>
                                       <span className="text-muted-foreground">
                                         / {formatCurrency(budget)}
                                       </span>
                                    </div>
                                    <Progress value={progress} className={cn("h-2", isOverBudget && "[&>div]:bg-destructive")} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
