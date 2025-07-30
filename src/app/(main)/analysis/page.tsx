
"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfMonth } from 'date-fns';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AnalysisPage() {
    const { transactions } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

    const handleMonthChange = (month: Date) => {
        setCurrentMonth(month);
    }
    
    const transactionsOnSelectedDate = useMemo(() => {
        return transactions.filter(t => isSameDay(t.date, selectedDate));
    }, [transactions, selectedDate]);

    const dailyTotal = useMemo(() => {
        return transactionsOnSelectedDate.reduce((sum, t) => sum + t.amount, 0);
    }, [transactionsOnSelectedDate]);

    const transactionDates = useMemo(() => {
        return transactions.map(t => t.date);
    }, [transactions]);
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
    };

    const DayWithDot = ({ date, month }: { date: Date, month: Date }) => {
        const hasTransactions = transactionDates.some(t => isSameDay(t, date));
        const isSelected = isSameDay(date, selectedDate);
        const isCurrentMonth = date.getMonth() === month.getMonth();

        return (
            <div className="relative">
                {date.getDate()}
                {hasTransactions && !isSelected && isCurrentMonth && (
                    <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"></div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-svh bg-background text-foreground">
            <header className="flex items-center justify-between p-2 border-b">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="w-5 h-5" />
                </Button>
                <h1 className="font-semibold text-base">Calendar view</h1>
                <div className="w-8"></div>
            </header>
            
            <div className="p-4">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => day && setSelectedDate(day)}
                    month={currentMonth}
                    onMonthChange={handleMonthChange}
                    className="p-0"
                    components={{
                        Day: ({ date }) => <DayWithDot date={date} month={currentMonth} />,
                    }}
                    classNames={{
                        head_cell: "w-full",
                        nav_button_previous: 'absolute left-1 h-7 w-7',
                        nav_button_next: 'absolute right-1 h-7 w-7',
                        caption_label: "font-medium text-sm",
                        day: "w-full h-10 rounded-full",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    }}
                 />
            </div>
            
            <div className="flex-1 flex flex-col bg-secondary rounded-t-3xl">
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold">{format(selectedDate, "EEEE, d MMM")}</h2>
                    <p className="font-semibold">{formatCurrency(dailyTotal)}</p>
                </div>
                <ScrollArea className="flex-1 px-4">
                    {transactionsOnSelectedDate.length > 0 ? (
                        <div className="space-y-3 pb-4">
                             <RecentTransactions transactions={transactionsOnSelectedDate} showTypeIndicator={false} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            No transactions for this day.
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
