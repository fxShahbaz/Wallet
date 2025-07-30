import { WalletCards } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
      <WalletCards className="w-8 h-8 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        TrackEase
      </h1>
    </div>
  );
}
