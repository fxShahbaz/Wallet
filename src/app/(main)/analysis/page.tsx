
"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isWithinInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DateRange } from 'react-day-picker';

export default function AnalysisPage() {
    const { transactions } = useApp();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
    const [appliedRange, setAppliedRange] = useState<DateRange | undefined>();

    const handleMonthChange = (month: Date) => {
        setCurrentMonth(month);
    }

    const handleApply = () => {
        setAppliedRange(dateRange);
    }
    
    const handleClear = () => {
        setDateRange(undefined);
        setAppliedRange(undefined);
    }

    const filteredTransactions = useMemo(() => {
        if (!appliedRange || !appliedRange.from) {
             const today = new Date();
             return transactions.filter(t => isSameDay(t.date, today));
        }
        const to = appliedRange.to ?? appliedRange.from;
        return transactions.filter(t => isWithinInterval(t.date, { start: appliedRange.from!, end: to }));
    }, [transactions, appliedRange]);

    const totalForPeriod = useMemo(() => {
        return filteredTransactions.reduce((sum, t) => {
            if (t.type === 'income') return sum + t.amount;
            if (t.type === 'expense') return sum - t.amount;
            return sum;
        }, 0);
    }, [filteredTransactions]);

    const transactionDates = useMemo(() => {
        return transactions.map(t => t.date);
    }, [transactions]);
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
    };

    const DayWithDot = ({ date, month }: { date: Date, month: Date }) => {
        const hasTransactions = transactionDates.some(t => isSameDay(t, date));
        const isCurrentMonth = date.getMonth() === month.getMonth();

        return (
            <div className="relative flex items-center justify-center h-full">
                <span>{date.getDate()}</span>
                {hasTransactions && isCurrentMonth && (
                    <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                )}
            </div>
        );
    };

    const getPeriodTitle = () => {
        if (!appliedRange || !appliedRange.from) {
            return `Today, ${format(new Date(), "d MMM")}`;
        }
        if (appliedRange.to) {
            return `${format(appliedRange.from, "d MMM")} - ${format(appliedRange.to, "d MMM")}`;
        }
        return format(appliedRange.from, "EEEE, d MMM");
    }

    return (
        <div className="flex flex-col h-svh bg-background text-foreground">
            <header className="flex items-center justify-between p-2 border-b h-14">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="w-5 h-5" />
                </Button>
                <h1 className="font-semibold text-base">Calendar view</h1>
                <div className="w-8"></div>
            </header>
            
            <div className="p-4 border-b">
                 <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    month={currentMonth}
                    onMonthChange={handleMonthChange}
                    className="p-0"
                    components={{
                        Day: ({ date }) => <DayWithDot date={date} month={currentMonth} />,
                    }}
                    classNames={{
                        head_row: "grid grid-cols-7",
                        row: "grid grid-cols-7",
                        head_cell: "w-full text-center font-normal text-sm",
                        cell: "w-full h-10 p-0",
                        day: "w-full h-full rounded-lg",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        day_range_start: "rounded-r-none",
                        day_range_end: "rounded-l-none",
                        day_range_middle: "bg-primary/20 rounded-none",
                        nav_button_previous: 'absolute left-1 h-7 w-7',
                        nav_button_next: 'absolute right-1 h-7 w-7',
                        caption_label: "font-medium text-sm",
                    }}
                 />
                 {dateRange && dateRange.from && (
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="ghost" onClick={handleClear}>Clear</Button>
                        <Button onClick={handleApply}>Apply</Button>
                    </div>
                 )}
            </div>
            
            <div className="flex-1 flex flex-col bg-secondary">
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold">{getPeriodTitle()}</h2>
                    <p className="font-semibold">{formatCurrency(totalForPeriod)}</p>
                </div>
                <ScrollArea className="flex-1 px-4">
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-3 pb-4">
                             <RecentTransactions transactions={filteredTransactions} showTypeIndicator={true} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            No transactions for this period.
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
