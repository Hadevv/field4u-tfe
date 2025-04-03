import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import { AlertCircle, Coins, Mail, User2 } from "lucide-react";

export const ACCOUNT_LINKS: NavigationLinkGroups[] = [
  {
    title: "PERSONAL INFORMATION",
    links: [
      { url: "/profile", title: "Profile", icon: <User2 /> },
      {
        url: "/profile/delete",
        title: "Delete profile",
        icon: <AlertCircle />,
      },
      { url: "/profile/billing", title: "Billing", icon: <Coins /> },
    ],
  },
  {
    title: "EMAIL SETTINGS",
    links: [{ url: "/profile/email", title: "Settings", icon: <Mail /> }],
  },
];
