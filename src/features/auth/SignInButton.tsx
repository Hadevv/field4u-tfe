"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { VariantProps } from "class-variance-authority";
import { UserDropdown } from "./UserDropdown";
import { displayName } from "@/lib/format/displayName";
import { useCallback } from "react";
import { useOpenSignInModal } from "@/lib/auth/open-signin-modal";

export const SignInButton = (props: VariantProps<typeof buttonVariants>) => {
  const openSignInModal = useOpenSignInModal();
  const pathname = usePathname() || "/";
  const signInUrl = `/auth/signin?callbackUrl=${pathname}`;

  const handleSignIn = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openSignInModal();
    },
    [openSignInModal],
  );

  return (
    <Button
      variant="outline"
      size="sm"
      className={buttonVariants({ size: "sm", variant: "outline", ...props })}
      asChild
    >
      <Link href={signInUrl} onClick={handleSignIn}>
        Sign in
      </Link>
    </Button>
  );
};

export const LoggedInButton = ({
  user,
}: {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}) => {
  return (
    <UserDropdown>
      <Button variant="outline" size="sm">
        <Avatar className="mr-2 size-6 bg-card">
          <AvatarFallback className="bg-card">
            {user.email.slice(0, 1).toUpperCase()}
          </AvatarFallback>
          {user.image && <AvatarImage src={user.image} />}
        </Avatar>
        <span className="max-lg:hidden">{displayName(user)}</span>
      </Button>
    </UserDropdown>
  );
};
