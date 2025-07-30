import React from 'react';
import { AppProvider } from '@/context/app-context';
import { MainNav } from '@/components/shared/main-nav';
import { AccountsList } from '@/components/accounts/accounts-list';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';
import { Logo } from '@/components/shared/logo';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4">
             <Logo />
          </SidebarHeader>
          <SidebarContent className="p-0">
            <div className="p-2">
              <MainNav />
            </div>
            <Separator />
            <AccountsList />
          </SidebarContent>
          <SidebarFooter className="p-2">
            <AddAccountSheet />
            <Button variant="ghost" className="justify-start w-full gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <main className="flex flex-col h-svh">
                {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
