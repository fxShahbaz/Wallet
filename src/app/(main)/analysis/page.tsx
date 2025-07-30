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
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';


export default function AnalysisPage() {
    const [date, setDate] = useState<DateRange | undefined>();

    const handleClear = () => {
        setDate(undefined);
    }

    const handleApply = () => {
        // You can add your apply logic here.
        // For now, we can just log the date range.
        console.log('Applied date range:', date);
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
                       <Popover>
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
                            {/* Page content goes here */}
                        </div>
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
