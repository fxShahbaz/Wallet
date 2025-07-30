"use client";

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function AnalysisPage() {
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
