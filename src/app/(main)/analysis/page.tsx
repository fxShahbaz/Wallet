
"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { DateRange } from 'react-day-picker';
import { IncomeExpenseBarChart } from '@/components/analysis/income-expense-bar-chart';
import { ExpensePieChart } from '@/components/analysis/expense-pie-chart';

export default function AnalysisPage() {
    const { transactions } = useApp();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const filteredTransactions = useMemo(() => {
        if (!dateRange || !dateRange.from) {
             return [];
        }
        const to = dateRange.to ?? dateRange.from;
        return transactions.filter(t => isWithinInterval(t.date, { start: dateRange.from!, end: to }));
    }, [transactions, dateRange]);


    return (
        <SidebarProvider>
            <Sidebar>
                {/* You can add sidebar content here if needed */}
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b h-14">
                       <SidebarTrigger className="md:hidden"/>
                       <h1 className="font-semibold text-lg">Reports</h1>
                       <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <CalendarIcon/>
                                    <span>
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            "Pick a date"
                                        )}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </header>
                    <ScrollArea className="flex-1 p-4">
                        <div className="grid gap-6">
                            <IncomeExpenseBarChart data={filteredTransactions} />
                            <ExpensePieChart data={filteredTransactions} />
                        </div>
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
