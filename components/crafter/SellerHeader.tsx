"use client";

import { ReactNode } from "react";

interface SellerHeaderProps {
  title: string;
  description?: string;
  /** Optional right-aligned slot, e.g. a primary action button like "Tambah Produk Baru". */
  actions?: ReactNode;
}

export default function SellerHeader({ title, description, actions }: SellerHeaderProps) {
  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
}