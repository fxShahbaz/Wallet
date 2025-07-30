"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { AddTransactionSheet } from '../dashboard/add-transaction-sheet';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analysis', label: 'Reports', icon: Calendar },
  { href: '/add', label: 'Add', icon: Plus }, 
  { href: '/wallets', label: 'Wallets', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 right-0 h-16 flex justify-center items-center md:hidden z-50">
      <div className="relative w-[90%] max-w-sm">
        <nav className="flex items-center justify-around h-full bg-card shadow-lg rounded-full">
          {links.map((link) => {
            const isActive = pathname === link.href;

            if (link.label === 'Add') {
              return (
                <div key="add-transaction" className="relative -top-5">
                  <Link href={link.href}>
                      <div className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform-colors",
                          isActive && "bg-foreground"
                          )}>
                          <link.icon className="w-7 h-7"/>
                          <span className="sr-only">Add Transaction</span>
                      </div>
                  </Link>
                </div>
              );
            }
            
            return (
              <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center text-xs gap-1 p-3">
                <link.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs", isActive ? "text-primary" : "text-muted-foreground")}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
