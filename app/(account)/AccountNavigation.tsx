import { Separator } from "@/components/ui/separator";
import { AuthButton } from "@/features/auth/AuthButton";
import { Layout } from "@/features/page/layout";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { DesktopVerticalMenu } from "../../src/features/navigation/DesktopVerticalMenu";
import { MobileDropdownMenu } from "../../src/features/navigation/MobileDropdownMenu";
import { ACCOUNT_LINKS } from "./account-links";
import { Logo } from "@/components/svg/Logo";

export const AccountNavigation = async (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <header className="w-full border-b bg-background max-lg:sticky max-lg:top-0 max-lg:z-40">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-bold ">
              <Logo />
            </Link>
          </div>

          <nav className="flex flex-1 items-center justify-end space-x-1">
            <AuthButton />
            <ThemeToggle />
            <MobileDropdownMenu className="lg:hidden" links={ACCOUNT_LINKS} />
          </nav>
        </div>
      </header>
      {/* Desktop ONLY Navigation bar */}
      <Layout className="flex flex-row items-start gap-4 pt-6">
        <DesktopVerticalMenu links={ACCOUNT_LINKS} className="max-lg:hidden" />
        <Separator className="max-lg:hidden" orientation="vertical" />
        <main className="flex-1 max-w-3xl mx-auto">{props.children}</main>
      </Layout>
    </div>
  );
};
