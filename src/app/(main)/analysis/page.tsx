
"use client";

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CalendarDays, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { isWithinInterval, startOfDay, endOfDay, format } from 'date-fns';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';


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
        <SidebarProvider>
            <Sidebar>
                {/* You can add sidebar content here if needed */}
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b h-14">
                       <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden"/>
                        <h1 className="font-semibold text-lg">Reports</h1>
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
                                    <Button size="sm" onClick={handleApply}>Apply</Button>
                                </div>
                            )}
                        </PopoverContent>
                       </Popover>
                    </header>
                    
                    <AnimatePresence>
                    {appliedDate && (
                       <motion.div 
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         transition={{ duration: 0.3 }}
                         className="sticky top-0 z-10 p-2 bg-background/80 backdrop-blur-sm border-b"
                       >
                            <div className="flex items-center justify-between max-w-4xl mx-auto">
                                <p className="text-sm font-medium text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {format(appliedDate.from!, 'd MMM')}
                                    </span>
                                    {appliedDate.to && appliedDate.from?.getTime() !== appliedDate.to?.getTime() ? ` - ${format(appliedDate.to, 'd MMM, yyyy')}` : `, ${format(appliedDate.from!, 'yyyy')}`}
                                </p>
                                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleClear}>
                                    <X className="w-4 h-4" />
                                    <span className="sr-only">Clear filter</span>
                                </Button>
                            </div>
                       </motion.iv>
                    )}
                    </AnimatePresence>

                    <ScrollArea className="flex-1 p-4">
                        <div className="grid gap-6">
                            {filteredTransactions.length > 0 ? (
                                <RecentTransactions transactions={filteredTransactions} showTypeIndicator={true} />
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center justify-center text-center text-muted-foreground py-8 gap-3"
                                >
                                    <CalendarDays className="w-10 h-10 text-gray-300" />
                                    <p className="text-sm">Select a date range to view transactions.</p>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
