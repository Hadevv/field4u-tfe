"use client";

import Image from "next/image";
import Link from "next/link";
import faviconLight from "../../../public/images/favicon-light.ico";
import faviconDark from "../../../public/images/favicon-dark.ico";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const FloatingLegalFooter = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-2 right-2 flex items-center gap-2 bg-background px-2 py-1 rounded-md shadow-sm">
        <Link
          className="text-xs text-muted-foreground hover:underline"
          href="/legal/privacy"
        >
          Politique de confidentialité
        </Link>
        <Link
          className="text-xs text-muted-foreground hover:underline"
          href="/legal/terms"
        >
          Conditions d'utilisation
        </Link>

        <Image
          src={faviconLight}
          width={20}
          height={20}
          alt="App icon"
          className="ml-2"
          style={{ width: "auto", height: "20px" }}
        />
      </div>
    );
  }

  const faviconToUse = resolvedTheme === "dark" ? faviconDark : faviconLight;

  return (
    <div className="fixed bottom-2 right-2 flex items-center gap-2 bg-background px-2 py-1 rounded-md shadow-sm">
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href="/legal/privacy"
      >
        Politique de confidentialité
      </Link>
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href="/legal/terms"
      >
        Conditions d'utilisation
      </Link>

      <Image
        src={faviconToUse}
        width={20}
        height={20}
        alt="App icon"
        className="ml-2"
        style={{ width: "auto", height: "20px" }}
      />
    </div>
  );
};
