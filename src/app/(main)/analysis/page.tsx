"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Landmark, PiggyBank, Wallet } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExpensePieChart } from '@/components/analysis/expense-pie-chart';
import { IncomeExpenseBarChart } from '@/components/analysis/income-expense-bar-chart';
import { Logo } from '@/components/shared/logo';
import { MainNav } from '@/components/shared/main-nav';
import { AccountsList } from '@/components/accounts/accounts-list';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';

export default function AnalysisPage() {
    const { transactions, accounts } = useApp();
    const isMobile = useIsMobile();
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAccount, setSelectedAccount] = useState<string>('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const date = t.date;
            const inDateRange = dateRange?.from && dateRange?.to && date >= dateRange.from && date <= dateRange.to;
            const isCategoryMatch = selectedCategory === 'all' || t.category === selectedCategory;
            const isAccountMatch = selectedAccount === 'all' || t.accountId === selectedAccount;
            return !!inDateRange && isCategoryMatch && isAccountMatch;
        });
    }, [transactions, dateRange, selectedCategory, selectedAccount]);
    
    const uniqueCategories = useMemo(() => ['all', ...Array.from(new Set(transactions.map(t => t.category)))], [transactions]);

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarContent>
                    <MainNav />
                    <AccountsList />
                </SidebarContent>
                <SidebarHeader>
                    <AddAccountSheet />
                </SidebarHeader>
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b shrink-0 md:px-6">
                        <div className="flex items-center gap-4">
                            {isMobile && <SidebarTrigger />}
                            <h1 className="text-2xl font-semibold font-headline">Analysis</h1>
                        </div>
                    </header>
                    <div className="flex-1 p-4 space-y-6 overflow-auto md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className="justify-start w-full text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by account..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <ExpensePieChart data={filteredTransactions} />
                            <IncomeExpenseBarChart data={filteredTransactions} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
