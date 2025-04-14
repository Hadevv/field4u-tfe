"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export const AccountLinkingNotification = () => {
  const [checked, setChecked] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated" && !checked) {
      setChecked(true);

      // appeler l'api pour vérifier si un compte a été récemment lié
      fetch("/api/auth/account-linked")
        .then((res) => res.json())
        .then((data) => {
          if (data.linked) {
            toast.success(
              "comptes liés avec succès! vous pouvez désormais vous connecter avec n'importe quel provider.",
            );
          }
        })
        .catch(() => {});
    }
  }, [session.status, checked]);

  return null;
};
