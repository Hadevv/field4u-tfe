import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import {
  LayoutDashboard,
  User2,
  MapPin,
  Megaphone,
  Calendar,
} from "lucide-react";

export const DASHBOARD_LINKS: NavigationLinkGroups[] = [
  {
    links: [
      {
        title: "dashboard",
        icon: <LayoutDashboard />,
        url: "/admin/dashboard",
      },
    ],
  },
  {
    title: "gestion",
    links: [
      {
        title: "utilisateurs",
        icon: <User2 />,
        url: "/admin/users",
      },
      {
        title: "champs",
        icon: <MapPin />,
        url: "/admin/fields",
      },
      {
        title: "annonces",
        icon: <Megaphone />,
        url: "/admin/announcements",
      },
      {
        title: "glanages",
        icon: <Calendar />,
        url: "/admin/gleanings",
      },
    ],
  },
];
