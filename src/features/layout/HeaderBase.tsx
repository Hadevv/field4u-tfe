"use client";

import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Menu, X } from "lucide-react";
import { NotificationsMenu } from "../notifications/NotificationsMenu";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type HeaderBaseProps = {
  isAuthenticated: boolean;
  isVerifyRequest?: boolean;
} & PropsWithChildren;

export function HeaderBase({
  children,
  isAuthenticated,
  isVerifyRequest,
}: HeaderBaseProps) {
  const pathname = usePathname();
  const showNotifications = isAuthenticated && pathname !== "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto py-2">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={SiteConfig.appIcon}
                alt="app logo"
                width={100}
                height={100}
              />
            </Link>
            {!isVerifyRequest && (
              <nav className="hidden items-center space-x-2 md:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/announcements/">
                    <MapPin className="size-4" />
                    Explorer la carte
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/my-gleanings">
                    <Heart className="size-4" />
                    Mes glanages
                  </Link>
                </Button>
              </nav>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
            {showNotifications && <NotificationsMenu />}
            {children}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {!isVerifyRequest && (
        <div
          className={cn(
            "md:hidden bg-background border-b overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-24 opacity-100"
              : "max-h-0 opacity-0 border-b-0",
          )}
        >
          <nav className="flex flex-col space-y-2 px-4 py-3">
            <Link
              href="/announcements/"
              className="flex items-center gap-2 px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="size-4" />
              Explorer la carte
            </Link>
            <Link
              href="/my-gleanings"
              className="flex items-center gap-2 px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="size-4" />
              Mes glanages
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
