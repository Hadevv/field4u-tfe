"use client";

import { Toaster } from "@/components/ui/sonner";
import { AccountLinkingNotification } from "@/features/auth/AccountLinkingNotification";
import { DialogManagerRenderer } from "@/features/dialog-manager/dialog-manager-renderer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <DialogManagerRenderer />
          <AccountLinkingNotification />
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
