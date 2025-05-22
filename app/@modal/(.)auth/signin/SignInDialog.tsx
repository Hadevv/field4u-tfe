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
import { useCallback } from "react";

export function SignInDialog() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isOpen = path.startsWith("/auth/signin");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // rediriger vers la page de callback si elle existe, sinon revenir en arrière
        if (callbackUrl && callbackUrl !== "/") {
          router.push(decodeURIComponent(callbackUrl));
        } else {
          router.back();
        }
      }
    },
    [router, callbackUrl],
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
