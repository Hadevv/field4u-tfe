"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { VariantProps } from "class-variance-authority";
import { UserDropdown } from "./UserDropdown";
import { displayName } from "@/lib/format/displayName";

export const SignInButton = (props: VariantProps<typeof buttonVariants>) => {
  const pathname = usePathname() || "/";
  const callbackUrl = encodeURIComponent(pathname);
  const signInUrl = `/auth/signin?callbackUrl=${callbackUrl}`;

  return (
    <Button
      variant="outline"
      size="sm"
      className={buttonVariants({ size: "sm", variant: "outline", ...props })}
      asChild
    >
      <Link href={signInUrl} replace={false} prefetch={false}>
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
