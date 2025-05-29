"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="/images/logo/logo-name-light.svg"
        alt="Field4U Logo"
        width={98}
        height={100}
        className="h-12 w-auto"
        priority
      />
    );
  }

  return (
    <Image
      src={
        resolvedTheme === "dark"
          ? "/images/logo/logo-name-dark.svg"
          : "/images/logo/logo-name-light.svg"
      }
      alt="Field4U Logo"
      width={98}
      height={100}
      className="h-12 w-auto"
      priority
    />
  );
}
