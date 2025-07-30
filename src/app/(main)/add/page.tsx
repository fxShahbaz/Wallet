"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { format, addDays, isSameDay, startOfToday } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLocalStorage } from 'react-use';
import { useRouter } from 'next/navigation';

const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

export default function AddTransactionPage() {
    const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { categories, addTransaction, accounts } = useApp();
    const router = useRouter();

    const [lastUsedAccount, setLastUsedAccount] = useLocalStorage('lastUsedAccount', accounts[0]?.id || '');

    const dates = useMemo(() => {
        const today = startOfToday();
        return Array.from({ length: 14 }, (_, i) => addDays(today, -i)).reverse();
    }, []);

    const handleNumpadPress = (key: string) => {
        if (key === '.') {
            if (!amount.includes('.')) {
                setAmount(prev => prev + '.');
            }
        } else {
            setAmount(prev => prev + key);
        }
    };

    const handleDelete = () => {
        setAmount(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setAmount('');
    }

    const handleSaveTransaction = () => {
        const numericAmount = parseFloat(amount);
        if (numericAmount > 0 && selectedCategory && lastUsedAccount) {
            addTransaction({
                type: transactionType,
                amount: numericAmount,
                date: selectedDate,
                category: selectedCategory,
                description: selectedCategory, // Or some other logic for description
                accountId: lastUsedAccount,
            });
            router.push('/');
        } else {
            // TODO: show some error to user
        }
    };

    useEffect(() => {
        if (accounts.length > 0 && !accounts.find(a => a.id === lastUsedAccount)) {
            setLastUsedAccount(accounts[0].id);
        }
    }, [accounts, lastUsedAccount, setLastUsedAccount]);

    const formatAmount = (value: string) => {
        if (!value) return "0.00";
        return parseFloat(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <header className="flex-shrink-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 p-1 rounded-full bg-gray-200/50">
                    <button 
                        onClick={() => setTransactionType('expense')}
                        className={cn(
                            "relative px-3 py-1 text-xs font-medium rounded-full",
                            transactionType === 'expense' ? "text-white" : "text-black"
                        )}
                    >
                         {transactionType === 'expense' && (
                            <motion.span
                                layoutId="active-type-bubble"
                                className="absolute inset-0 bg-black"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Expenses</span>
                    </button>
                    <button 
                        onClick={() => setTransactionType('income')}
                        className={cn(
                            "relative px-3 py-1 text-xs font-medium rounded-full",
                            transactionType === 'income' ? "text-white" : "text-black"
                        )}
                    >
                         {transactionType === 'income' && (
                            <motion.span
                                layoutId="active-type-bubble"
                                className="absolute inset-0 bg-black"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Income</span>
                    </button>
                </div>
                <button onClick={() => router.back()} className="p-2">
                    <X className="w-5 h-5" />
                </button>
            </header>
            
            <div className="flex-shrink-0">
                <div className="flex overflow-x-auto p-4 space-x-4">
                    {dates.map(date => (
                        <button key={date.toString()} onClick={() => setSelectedDate(date)} className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-lg w-10 h-12 shrink-0 transition-colors",
                            isSameDay(date, selectedDate) ? "bg-black text-white" : "hover:bg-gray-100"
                        )}>
                            <span className="text-xs font-medium">{format(date, 'd')}</span>
                            <span className="text-xs uppercase">{format(date, 'eee')}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="flex items-end">
                    <span className="text-3xl font-medium -mb-1">$</span>
                    <AnimatePresence mode="popLayout">
                        <motion.span 
                            key={amount}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-6xl font-light tracking-tighter"
                        >
                            {amount || '0'}
                        </motion.span>
                    </AnimatePresence>
                </div>
                 <div className="h-8 mt-3">
                    <AnimatePresence>
                        {selectedCategory && (
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs"
                            >
                                <span>{selectedCategory}</span>
                                <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-white">
                                    <X className="w-3 h-3"/>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <div className="flex-shrink-0 p-4">
                <div className="flex overflow-x-auto space-x-3 mb-4">
                    {categories.map(cat => (
                        <button 
                            key={cat.value} 
                            onClick={() => setSelectedCategory(cat.label)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-full",
                                selectedCategory === cat.label ? "bg-black text-white" : "bg-gray-100 text-black"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {numpadKeys.map(key => (
                        <button 
                            key={key} 
                            onClick={() => handleNumpadPress(key)} 
                            className="h-14 text-xl font-light rounded-full bg-gray-100 active:bg-gray-200"
                        >
                            {key}
                        </button>
                    ))}
                    <button onClick={handleSaveTransaction} className="h-14 flex items-center justify-center text-xl font-light rounded-full bg-black text-white active:bg-gray-800">
                        <Check className="w-7 h-7"/>
                    </button>
                </div>
            </div>

        </div>
    );
}
