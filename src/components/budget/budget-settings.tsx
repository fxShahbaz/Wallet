
"use client"

import { useState } from 'react';
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
import { Category } from '@/lib/types';
import { HelpCircle } from 'lucide-react';

const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '-';
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

export function BudgetSettings() {
    const { expenseCategories } = useApp();

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground px-1">Category Budgets</h2>
            <div className="bg-card rounded-xl border">
                {expenseCategories.map((category, index) => {
                     const Icon = category.icon || HelpCircle;
                    return (
                        <div key={category.value} className={`flex items-center justify-between p-3 ${index < expenseCategories.length - 1 ? 'border-b' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center p-2 bg-background rounded-full w-9 h-9">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{category.label}</p>
                                    <p className="text-xs text-muted-foreground">Budget: {formatCurrency(category.budget)}</p>
                                </div>
                            </div>
                            <SetBudgetDialog category={category}>
                                <Button variant="outline" size="sm">Set Budget</Button>
                            </SetBudgetDialog>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
