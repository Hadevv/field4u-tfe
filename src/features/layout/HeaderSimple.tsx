"use client";

import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";

export function HeaderSimple() {
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
                style={{ height: "auto" }}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
