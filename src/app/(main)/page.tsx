"use client";

import { SummaryCards } from '@/components/dashboard/summary-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AddTransactionSheet } from '@/components/dashboard/add-transaction-sheet';
import { UserNav } from '@/components/shared/user-nav';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { SidebarTrigger as MobileSidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';


export default function DashboardPage() {
    const isMobile = useIsMobile();
    
    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b shrink-0 md:px-6">
                <div className="flex items-center gap-4">
                    {isMobile && <MobileSidebarTrigger />}
                    <h1 className="text-2xl font-semibold font-headline">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <AddTransactionSheet />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="w-5 h-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <UserNav />
                </div>
            </header>
            <div className="flex-1 p-4 space-y-6 overflow-auto md:p-6">
                <SummaryCards />
                <RecentTransactions />
            </div>
            {isMobile && (
                 <div className="p-4 mt-auto border-t bg-background">
                    <AddTransactionSheet />
                 </div>
            )}
        </div>
    );
}
