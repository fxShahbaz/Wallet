
"use client";

import { useApp } from '@/context/app-context';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function AccountsList() {
  const { accounts } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Accounts</SidebarGroupLabel>
      <SidebarMenu>
        {accounts.map((account) => (
          <SidebarMenuItem key={account.id}>
            <SidebarMenuButton size="sm" asChild className="h-auto py-1">
                <a href="#" className="flex justify-between w-full">
                    <div className="flex items-center gap-2">
                        {account.icon && <account.icon className="w-4 h-4" />}
                        <span className="truncate">{account.name}</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                        {formatCurrency(account.balance)}
                    </span>
                </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

    