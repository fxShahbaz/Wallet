"use client";

import { Loader } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
