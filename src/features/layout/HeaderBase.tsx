"use client";

import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { NotificationsMenu } from "../notifications/NotificationsMenu";
import { usePathname } from "next/navigation";

type HeaderBaseProps = {
  isAuthenticated: boolean;
} & PropsWithChildren;

export function HeaderBase({ children, isAuthenticated }: HeaderBaseProps) {
  const pathname = usePathname();
  const showNotifications = isAuthenticated && pathname !== "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto py-2">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={SiteConfig.appIcon}
                alt="app logo"
                width={32}
                height={32}
              />
              <span className="text-base font-bold">{SiteConfig.title}</span>
            </Link>

            <nav className="hidden items-center space-x-2 md:flex">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/explorer">
                  <MapPin className="size-4" />
                  Explorer la carte
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/forum">Forum</Link>
              </Button>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {showNotifications && <NotificationsMenu />}
            {children}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
