import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import { Tractor, FileText, MapPin, BarChart3 } from "lucide-react";

export const FARMER_LINKS: NavigationLinkGroups[] = [
  {
    links: [
      {
        title: "Tableau de bord",
        icon: <BarChart3 />,
        url: "/farm",
      },
    ],
  },
  {
    title: "Mon exploitation",
    links: [
      {
        title: "Mon exploitation",
        icon: <Tractor />,
        url: "/farm/details",
      },
      {
        title: "Mes champs",
        icon: <MapPin />,
        url: "/farm/fields",
      },
    ],
  },
  {
    title: "Glanage",
    links: [
      {
        title: "Mes annonces",
        icon: <FileText />,
        url: "/farm/announcements",
      },
      {
        title: "Nouvelle annonce",
        icon: <FileText />,
        url: "/farm/announcements/new",
      },
    ],
  },
];
