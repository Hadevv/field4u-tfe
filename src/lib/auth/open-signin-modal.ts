"use client";
import { useRouter, usePathname } from "next/navigation";

export function useOpenSignInModal() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  return (callbackUrl?: string) => {
    router.push(
      `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl || pathname)}`,
    );
  };
}
