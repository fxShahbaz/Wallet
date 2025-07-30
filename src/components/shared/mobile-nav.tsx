"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Wallet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddTransactionSheet } from '../dashboard/add-transaction-sheet';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analysis', label: 'Analysis', icon: BarChart2 },
  { href: '#', label: 'Add', icon: null }, // Placeholder for the FAB
  { href: '/wallets', label: 'Wallets', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t md:hidden">
      <nav className="flex items-center justify-around h-full">
        {links.map((link, index) => {
          if (link.label === 'Add') {
            return (
              <div key="add-transaction" className="relative -top-6">
                <AddTransactionSheet />
              </div>
            );
          }
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center text-xs gap-1">
              <link.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span className={cn("text-xs", isActive ? "text-primary-foreground" : "text-muted-foreground")}>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
