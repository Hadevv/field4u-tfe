"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SignInProviders } from "../../../auth/signin/SignInProviders";
import { SiteConfig } from "@/site-config";
import { useCallback, useEffect, useState } from "react";

export function SignInDialog() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(path.startsWith("/auth/signin"));
  }, [path]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);

      if (!open) {
        const redirectUrl =
          callbackUrl && callbackUrl !== "/" ? callbackUrl : "/";
        try {
          router.replace(redirectUrl);
          setTimeout(() => {
            try {
              window.history.replaceState(null, "", redirectUrl);
              router.refresh();
            } catch (e) {
              window.location.href = redirectUrl;
            }
          }, 100);
        } catch (error) {
          console.error("Erreur lors de la redirection:", error);
          window.location.href = redirectUrl;
        }
      }
    },
    [callbackUrl, router],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={100}
            height={100}
            priority
          />
          <DialogTitle>Connectez-vous à votre compte</DialogTitle>
        </DialogHeader>
        <SignInProviders />
      </DialogContent>
    </Dialog>
  );
}
