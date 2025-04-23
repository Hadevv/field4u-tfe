import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Leaf, MapPin, Coins, Users, Tag } from "lucide-react";

type StatisticsCardsProps = {
  totalUsers: number;
  totalFields: number;
  totalGleanings: number;
  totalAnnouncements: number;
  activeWeeklyGleaners: number;
  totalDonations: number;
};

export default function StatisticsCards(props: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">utilisateurs</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            inscrits sur plateforme
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">champs</CardTitle>
          <MapPin className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.totalFields}</div>
          <p className="text-xs text-muted-foreground">
            disponibles pour glanage
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">glanages</CardTitle>
          <Leaf className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.totalGleanings}</div>
          <p className="text-xs text-muted-foreground">réalisés avec succès</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">annonces</CardTitle>
          <Tag className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.totalAnnouncements}</div>
          <p className="text-xs text-muted-foreground">
            publiées par agriculteurs
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">glaneurs actifs</CardTitle>
          <CalendarClock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.activeWeeklyGleaners}</div>
          <p className="text-xs text-muted-foreground">cette semaine</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">dons (€)</CardTitle>
          <Coins className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.totalDonations}</div>
          <p className="text-xs text-muted-foreground">
            collectés pour associations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
