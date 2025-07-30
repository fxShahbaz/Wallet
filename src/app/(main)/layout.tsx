
"use client";

import React, { useEffect } from 'react';
import { MobileNav } from '@/components/shared/mobile-nav';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { Preloader } from '@/components/shared/preloader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    // Wait for the app context to determine the user state
    if (user === null) {
      const timer = setTimeout(() => {
        if (!user) {
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      }, 600); // A little more than the context loading delay
      return () => clearTimeout(timer);
    } else {
       setIsChecking(false);
    }
  }, [user, router]);
  
  if (isChecking) {
    return <Preloader />;
  }
  
  return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-md bg-background shadow-lg">
          <main className="flex flex-col h-svh bg-background">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
  );
}
