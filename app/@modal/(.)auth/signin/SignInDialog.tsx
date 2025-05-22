"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { SignInProviders } from "../../../auth/signin/SignInProviders";
import { SiteConfig } from "@/site-config";
import { useEffect, useState, useCallback, useTransition } from "react";

export function SignInDialog() {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // vérifier si on est sur la page de connexion
    const isSignInPath = path.startsWith("/auth/signin");
    setIsOpen(isSignInPath);
  }, [path]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        // utiliser startTransition pour naviguer en arrière de manière fluide
        startTransition(() => {
          router.back();
        });
      }
    },
    [router],
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
