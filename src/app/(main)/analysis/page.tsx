
"use client";

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/context/app-context';
import { Transaction } from '@/lib/types';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';


export default function AnalysisPage() {
    const { transactions } = useApp();
    const [date, setDate] = useState<DateRange | undefined>();
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        setDate(undefined);
        setFilteredTransactions([]);
    }

    const handleApply = () => {
        if (date?.from && date?.to) {
            const range = { start: startOfDay(date.from), end: endOfDay(date.to) };
            const filtered = transactions.filter(t => isWithinInterval(t.date, range));
            setFilteredTransactions(filtered);
        } else if (date?.from) {
            const range = { start: startOfDay(date.from), end: endOfDay(date.from) };
            const filtered = transactions.filter(t => isWithinInterval(t.date, range));
            setFilteredTransactions(filtered);
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
                                    <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
                                    <Button size="sm" onClick={handleApply}>Apply</Button>
                                </div>
                            )}
                        </PopoverContent>
                       </Popover>
                    </header>
                    <ScrollArea className="flex-1 p-4">
                        <div className="grid gap-6">
                            {filteredTransactions.length > 0 ? (
                                <RecentTransactions transactions={filteredTransactions} showTypeIndicator={true} />
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>Select a date range to view transactions.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
