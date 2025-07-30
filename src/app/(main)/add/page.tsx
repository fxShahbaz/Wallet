
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, X, ArrowLeft, ArrowRight, TrendingUp, StickyNote, Folders, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


const transactionFormSchema = z.object({
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    date: z.date(),
    type: z.enum(['expense', 'income', 'investment']),
    description: z.string().optional(),
    category: z.string().min(1, { message: "Please select a category." }),
    recurring: z.boolean(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const SegmentedControl = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { value: string, label: string, icon: React.ReactNode }[]}) => {
    return (
        <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors",
                        value === option.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-gray-200"
                    )}
                >
                    {option.icon}
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export default function AddTransactionPage() {
    const router = useRouter();
    const { categories, addTransaction, accounts } = useApp();
    const [amount, setAmount] = useState('0,00');

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            date: new Date(),
            type: 'expense',
            description: '',
            category: '',
            recurring: false,
        },
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9,]/g, '');
        
        if (value.startsWith(',')) {
            value = '0' + value;
        }

        const parts = value.split(',');
        if (parts.length > 2) {
            value = `${parts[0]},${parts.slice(1).join('')}`;
        }
        
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
            value = parts.join(',');
        }
        
        setAmount(value);

        const numericValue = parseFloat(value.replace(',', '.'));
        form.setValue('amount', isNaN(numericValue) ? 0 : numericValue);
    };

    const onSubmit = (data: TransactionFormValues) => {
        const selectedAccount = accounts[0]; // Or some logic to select an account
        if (selectedAccount) {
            addTransaction({
                ...data,
                accountId: selectedAccount.id,
            });
            router.push('/');
        }
    };
    
    return (
        <div className="h-full bg-white flex flex-col">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-white z-10">
                <button onClick={() => router.back()} className="p-2">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
                <h1 className="text-md font-semibold">New Transaction</h1>
                <div className="w-9"></div>
            </header>

            <div className="flex-1 flex flex-col items-center p-4">
                 <div className="relative">
                    <input 
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="text-5xl font-bold text-center bg-transparent border-none focus:ring-0 outline-none w-full"
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300 -mr-8">€</span>
                </div>
            </div>

            <div className="p-4 pt-8 space-y-4 flex-grow">
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
                    <Controller
                        name="date"
                        control={form.control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="w-full text-left p-3 rounded-xl border bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="font-medium">{format(field.value, 'PPP')}</p>
                                        </div>
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="center">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => date && field.onChange(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />

                    <Controller
                        name="type"
                        control={form.control}
                        render={({ field }) => (
                           <SegmentedControl
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                    { value: 'expense', label: 'Expense', icon: <ArrowLeft className="w-4 h-4" /> },
                                    { value: 'income', label: 'Income', icon: <ArrowRight className="w-4 h-4" /> },
                                    { value: 'investment', label: 'Investment', icon: <TrendingUp className="w-4 h-4" /> },
                                ]}
                           />
                        )}
                    />
                    
                    <div className="relative">
                        <StickyNote className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Description" className="pl-10 p-3 h-12 bg-gray-50 border rounded-xl" />
                            )}
                        />
                    </div>
                    
                    <div className="relative">
                        <Folders className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full pl-10 p-3 h-12 bg-gray-50 border rounded-xl">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {form.formState.errors.category && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.category.message}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Repeat className="w-5 h-5 text-gray-400"/>
                            <div>
                                <p className="font-medium text-sm">Add as recurring</p>
                                <p className="text-xs text-gray-500">This transaction will be added again the following months at the same day as today</p>
                            </div>
                        </div>
                         <Controller
                            name="recurring"
                            control={form.control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex-grow"></div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800">
                        Add Transaction
                    </Button>
                </form>
            </div>
        </div>
    );
}


    