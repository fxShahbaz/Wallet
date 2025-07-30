
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Wallet, Settings, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analysis', label: 'Reports', icon: Calendar },
  { href: '/add', label: 'Add', icon: Plus }, 
  { href: '/wallets', label: 'Wallets', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setSubmitTransactionForm } = useApp();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (pathname !== '/add') {
      setIsSaved(false);
    }
  }, [pathname]);

  const handleAddClick = (e: React.MouseEvent) => {
    if (pathname === '/add') {
      e.preventDefault();
      setSubmitTransactionForm(true);
      setIsSaved(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };
  
  const getIcon = () => {
    if (isSaved) return Check;
    if (pathname === '/add') return Check;
    return Plus;
  }

  const Icon = getIcon();

  return (
    <div className="fixed bottom-4 left-0 right-0 h-16 flex justify-center items-center md:hidden z-50">
      <div className="relative w-[90%] max-w-sm">
        <nav className="flex items-center justify-around h-full bg-card shadow-lg rounded-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isAddButton = link.label === 'Add';

            if (isAddButton) {
              return (
                <div key="add-transaction" className="relative -top-5">
                  <Link href={link.href} onClick={handleAddClick}>
                      <div className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform-colors",
                          isActive && "bg-foreground"
                          )}>
                          <AnimatePresence mode="wait">
                            <motion.div
                                key={Icon.displayName}
                                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon className="w-7 h-7"/>
                            </motion.div>
                          </AnimatePresence>
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
