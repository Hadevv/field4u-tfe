import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import { AlertCircle, Coins, Mail, User2 } from "lucide-react";

export const ACCOUNT_LINKS: NavigationLinkGroups[] = [
  {
    title: "INFORMATIONS PERSONNELLES",
    links: [
      { url: "/profile", title: "Profil", icon: <User2 /> },
      {
        url: "/profile/delete",
        title: "Supprimer le compte",
        icon: <AlertCircle />,
      },
      { url: "/profile/billing", title: "Facturation", icon: <Coins /> },
    ],
  },
  {
    title: "PARAMÈTRES DE NOTIFICATIONS PAR EMAIL",
    links: [{ url: "/profile/email", title: "Paramètres", icon: <Mail /> }],
  },
];
