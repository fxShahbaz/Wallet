
"use client";

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CalendarDays, X, Heart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { isWithinInterval, startOfDay, endOfDay, format } from 'date-fns';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SummaryCards } from '@/components/analysis/summary-cards';
import Link from 'next/link';


export default function AnalysisPage() {
    const { transactions } = useApp();
    const [date, setDate] = useState<DateRange | undefined>();
    const [appliedDate, setAppliedDate] = useState<DateRange | undefined>();
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        setDate(undefined);
        setAppliedDate(undefined);
        setFilteredTransactions([]);
    }

    const handleApply = () => {
        if (date?.from && date?.to) {
            const range = { start: startOfDay(date.from), end: endOfDay(date.to) };
            const filtered = transactions.filter(t => isWithinInterval(t.date, range));
            setFilteredTransactions(filtered);
            setAppliedDate(date);
        } else if (date?.from) {
            const range = { start: startOfDay(date.from), end: endOfDay(date.from) };
            const filtered = transactions.filter(t => isWithinInterval(t.date, range));
            setFilteredTransactions(filtered);
            setAppliedDate({ from: date.from, to: date.from });
        }
        setIsOpen(false);
    }
    

    return (
        <div className="flex flex-col h-full relative">
            <header className="flex items-center justify-between p-4 border-b h-14 shrink-0">
               <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Statistics</h1>
               </div>
               <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="sr-only">Filter by date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                    />
                    {date?.from && (
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>Clear</Button>
                            <Button size="sm" onClick={handleApply}>Date Apply</Button>
                        </div>
                    )}
                </PopoverContent>
               </Popover>
            </header>
            
            <AnimatePresence>
            {appliedDate && (
                <div
                    className="absolute top-20 z-10 w-full flex justify-center"
                >
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium shadow-lg">
                        <p className="text-muted-foreground">
                            <span className="text-foreground">
                                {format(appliedDate.from!, 'MMM d, yyyy')}
                            </span>
                            {appliedDate.to && appliedDate.from?.getTime() !== appliedDate.to?.getTime() ? ` - ${format(appliedDate.to, 'MMM d, yyyy')}` : ''}
                        </p>
                        <button onClick={handleClear} className="p-1 rounded-full bg-background hover:bg-muted">
                            <X className="w-3 h-3" />
                            <span className="sr-only">Clear filter</span>
                        </button>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>

            <ScrollArea className="flex-1">
                <div className={cn("px-4 pb-4 space-y-6", appliedDate && 'pt-16')}>
                    {filteredTransactions.length > 0 ? (
                        <>
                            <SummaryCards transactions={filteredTransactions} />
                            <RecentTransactions transactions={filteredTransactions} showTypeIndicator={true} />
                        </>
                    ) : (
                        <div className="pt-12 space-y-4">
                            <div className="text-center p-6 border rounded-xl">
                                <p className="text-lg font-semibold mb-2">Enjoying the app?</p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Buy a coffee for the developer.
                                    <br/>
                                    Made with <Heart className="inline w-4 h-4 text-red-500 fill-current" /> by Shahbaz
                                </p>

                                <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg">
                                    <Link href="https://buymeacoffee.com/howdyshahbaz" target="_blank">
                                        Buy me a coffee
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
