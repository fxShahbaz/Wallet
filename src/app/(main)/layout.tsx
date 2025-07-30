import React from 'react';
import { AppProvider } from '@/context/app-context';
import { MobileNav } from '@/components/shared/mobile-nav';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-md bg-background shadow-lg">
          <main className="flex flex-col h-svh bg-background">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </AppProvider>
  );
}
