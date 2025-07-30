import React from 'react';
import { AppProvider } from '@/context/app-context';
import { MobileNav } from '@/components/shared/mobile-nav';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <main className="flex flex-col h-svh bg-background">
        {children}
      </main>
      <MobileNav />
    </AppProvider>
  );
}
