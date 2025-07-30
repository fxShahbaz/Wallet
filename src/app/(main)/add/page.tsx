
"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, X, ArrowLeft, ArrowRight, TrendingUp, FileText, Folder, Landmark, Tag, Users, CreditCard, CheckCircle, MapPin, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';


const transactionFormSchema = z.object({
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    date: z.date(),
    type: z.enum(['expense', 'income', 'investment']),
    description: z.string().optional(),
    category: z.string().min(1, { message: "Please select a category." }),
    accountId: z.string().min(1, { message: "Please select an account." }),
    label: z.string().optional(),
    note: z.string().optional(),
    payee: z.string().optional(),
    paymentType: z.string().optional(),
    status: z.string().optional(),
    location: z.string().optional(),
    photo: z.any().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const SegmentedControl = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { value: string, label: string, icon: React.ReactNode }[]}) => {
    return (
        <div className="relative flex items-center gap-2 p-1 rounded-xl bg-muted">
            {options.map(option => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "relative flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors",
                         value !== option.value ? "text-muted-foreground hover:bg-background/50" : "text-foreground"
                    )}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                    {value === option.value && (
                        <motion.div
                            layoutId="segmented-control-active"
                            className="absolute inset-0 bg-card rounded-lg shadow-sm"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    )
}

export default function AddTransactionPage() {
    const router = useRouter();
    const { expenseCategories, incomeCategories, addTransaction, accounts, submitTransactionForm, setSubmitTransactionForm, setTransactionType } = useApp();
    const [amount, setAmount] = useState('0');
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            date: new Date(),
            type: 'expense',
            description: '',
            category: '',
            accountId: '',
            label: '',
            note: '',
            payee: '',
            paymentType: 'UPI',
            status: 'Cleared',
            location: '',
        },
    });

    const currentTransactionType = form.watch('type');

    useEffect(() => {
        setTransactionType(currentTransactionType);
    }, [currentTransactionType, setTransactionType]);

    useEffect(() => {
        if (submitTransactionForm) {
            form.handleSubmit(onSubmit)();
            setSubmitTransactionForm(false); 
        }
    }, [submitTransactionForm, form, setSubmitTransactionForm]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        
        if (value.startsWith('.')) {
            value = '0' + value;
        }

        const parts = value.split('.');
        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }
        
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
            value = parts.join('.');
        }
        
        setAmount(value);

        const numericValue = parseFloat(value);
        form.setValue('amount', isNaN(numericValue) ? 0 : numericValue);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAttachPhotoClick = () => {
        photoInputRef.current?.click();
    };


    const onSubmit = (data: TransactionFormValues) => {
        addTransaction({
            ...data,
            category: data.category,
            description: data.note || '',
            photo: photoPreview || undefined,
        });
    };
    
    const categoriesToShow = currentTransactionType === 'income' ? incomeCategories : expenseCategories;

    return (
        <motion.div 
            className="bg-background h-full flex flex-col"
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
             <header className="flex items-center justify-between p-4 shrink-0 max-w-lg mx-auto w-full">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <X className="w-5 h-5" />
                </Button>
                <h1 className="font-semibold text-lg">New Transaction</h1>
                <div className="w-10"></div>
            </header>
            <ScrollArea className="flex-1">
                <div className="max-w-lg mx-auto px-4 pb-36">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="pt-6 flex justify-center">
                           <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="text-3xl font-bold bg-transparent border-none focus:ring-0 outline-none text-center w-full"
                                    style={{ minWidth: '1ch' }}
                                />
                           </div>
                        </div>
                        <div className="pt-6 space-y-4">
                            <Controller
                                name="date"
                                control={form.control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button type="button" className="w-full text-left p-2 rounded-xl border bg-background flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground">Date</p>
                                                    <p className="font-medium text-xs">{format(field.value, 'PPP')}</p>
                                                </div>
                                                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
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
                                        onChange={(value) => {
                                            field.onChange(value);
                                            form.setValue('category', '');
                                        }}
                                        options={[
                                            { value: 'expense', label: 'Expense', icon: <ArrowLeft className="w-3 h-3" /> },
                                            { value: 'income', label: 'Income', icon: <ArrowRight className="w-3 h-3" /> },
                                            { value: 'investment', label: 'Investment', icon: <TrendingUp className="w-3 h-3" /> },
                                        ]}
                                   />
                                )}
                            />
                            
                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                               <Landmark className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="accountId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full p-0 h-auto bg-transparent border-none focus:ring-0 text-xs shadow-none">
                                                <SelectValue placeholder="Select Bank Account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                 {form.formState.errors.accountId && (
                                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.accountId.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="category"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full p-0 h-auto bg-transparent border-none focus:ring-0 text-xs shadow-none">
                                                 <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoriesToShow.map(cat => (
                                                    <SelectItem key={cat.value} value={cat.label}>{cat.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                 {form.formState.errors.category && (
                                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.category.message}</p>
                                )}
                            </div>
                             <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="label"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Add Label (custom)" className="p-0 h-auto bg-transparent border-none focus-visible:ring-0 text-xs w-full" />
                                    )}
                                />
                            </div>

                             <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-2 self-start" />
                                <Controller
                                    name="note"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder="Description" className="p-0 h-auto bg-transparent border-none focus-visible:ring-0 text-xs w-full" rows={2}/>
                                    )}
                                />
                            </div>
                            
                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="payee"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={currentTransactionType === 'income' ? 'Payer' : 'Payee'} className="p-0 h-auto bg-transparent border-none focus-visible:ring-0 text-xs w-full" />
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="paymentType"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full p-0 h-auto bg-transparent border-none focus:ring-0 text-xs shadow-none">
                                                <SelectValue placeholder="Payment Mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Voucher', 'UPI'].map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            
                             <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <CheckCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full p-0 h-auto bg-transparent border-none focus:ring-0 text-xs shadow-none">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Cleared', 'Uncleared', 'Reconciled'].map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            
                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Controller
                                    name="location"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Add Location" className="p-0 h-auto bg-transparent border-none focus-visible:ring-0 text-xs w-full" />
                                    )}
                                />
                            </div>

                            <input
                                type="file"
                                ref={photoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            <div className="flex items-center gap-3 p-2 bg-background rounded-xl border">
                               <Camera className="w-4 h-4 text-muted-foreground shrink-0" />
                               <button type="button" onClick={handleAttachPhotoClick} className="text-xs text-foreground">Attach Photo</button>
                            </div>

                            {photoPreview && (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                    <Image src={photoPreview} alt="Selected photo" layout="fill" objectFit="cover" />
                                     <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                        onClick={() => {
                                            setPhotoPreview(null);
                                            form.setValue('photo', null);
                                            if(photoInputRef.current) photoInputRef.current.value = '';
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </ScrollArea>
        </motion.div>
    );

}
