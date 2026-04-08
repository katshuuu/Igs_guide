"use client";

import { usePathname } from "next/navigation";
import { IngosHeader } from "@/components/guide/ingos-header";
import { IngosFooter } from "@/components/guide/ingos-footer";

const STANDALONE_PREFIX = "/guide-app";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone =
    pathname === STANDALONE_PREFIX || pathname?.startsWith(`${STANDALONE_PREFIX}/`);

  if (standalone) {
    return (
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <IngosHeader />
      {children}
      <IngosFooter />
    </div>
  );
}
