import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import { LayoutDashboard, Settings, User2 } from "lucide-react";

export const DASHBOARD_LINKS: NavigationLinkGroups[] = [
  {
    links: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard />,
        url: "/admin/dashboard",
      },
      {
        title: "Settings",
        icon: <Settings />,
        url: "/admin/settings",
      },
    ],
  },
  {
    title: "Other",
    links: [
      {
        title: "Users",
        icon: <User2 />,
        url: "/admin/users",
      },
    ],
  },
];
