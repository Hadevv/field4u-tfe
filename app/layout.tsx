/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import { FloatingLegalFooter } from "@/features/legal/FloatingLegalFooter";
import { NextTopLoader } from "@/features/page/NextTopLoader";
import { getServerUrl } from "@/lib/server-url";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import type { LayoutParams } from "@/types/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import type { ReactNode } from "react";
import "./globals.scss";
import { Providers } from "./providers";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
};

export default function RootLayout({
  children,
  modal,
}: LayoutParams<{}> & { modal?: ReactNode }) {
  return (
    <>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
          <PlausibleProvider domain={SiteConfig.domain} />
        </head>
        <body
          suppressHydrationWarning
          className={cn(
            "h-full bg-background font-sans antialiased",
            GeistMono.variable,
            GeistSans.variable,
          )}
        >
          <NuqsAdapter>
            <Providers>
              <NextTopLoader
                delay={100}
                showSpinner={false}
                color="hsl(var(--primary))"
              />
              {children}
              {modal}
              <TailwindIndicator />
              <FloatingLegalFooter />
            </Providers>
          </NuqsAdapter>
        </body>
      </html>
    </>
  );
}
