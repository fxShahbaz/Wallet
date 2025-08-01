
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
    // If the user state is still loading, we wait.
    if (user === undefined) {
      return;
    }
    // If the user is null (not logged in), redirect to login.
    if (user === null) {
      router.push('/login');
    } else {
      // If user is logged in, stop checking.
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
