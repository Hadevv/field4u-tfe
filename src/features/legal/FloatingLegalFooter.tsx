import Image from "next/image";
import Link from "next/link";
import favicon from "../../../app/favicon.ico";

export const FloatingLegalFooter = () => {
  return (
    <div className="fixed bottom-2 right-2 flex items-center gap-2">
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
      <Image src={favicon} width={20} height={20} alt="app icon" />
    </div>
  );
};
