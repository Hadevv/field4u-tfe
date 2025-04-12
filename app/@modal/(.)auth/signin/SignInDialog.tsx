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
export function SignInDialog() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Dialog
      open={path.startsWith("/auth/signin")}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-card">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={100}
            height={100}
          />
          <DialogTitle>Sign in to your account</DialogTitle>
        </DialogHeader>
        <SignInProviders />
      </DialogContent>
    </Dialog>
  );
}
