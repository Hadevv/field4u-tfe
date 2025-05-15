"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import type { VariantProps } from "class-variance-authority";
import { UserDropdown } from "./UserDropdown";
import { displayName } from "@/lib/format/displayName";

export const SignInButton = (props: VariantProps<typeof buttonVariants>) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const callbackUrl = encodeURIComponent(pathname);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
  };

  return (
    <a
      href={`/auth/signin?callbackUrl=${callbackUrl}`}
      onClick={handleClick}
      className={buttonVariants({ size: "sm", variant: "outline", ...props })}
    >
      Sign in
    </a>
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
