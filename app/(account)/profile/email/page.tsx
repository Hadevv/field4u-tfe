import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requiredAuth } from "@/lib/auth/helper";
import { ToggleNotificationsCheckbox } from "./ToggleNotificationsCheckbox";

export default async function NotificationsPage() {
  const user = await requiredAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notifications</CardTitle>
        <CardDescription>
          Mettez à jour vos paramètres de notifications pour l'application
          field4u
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleNotificationsCheckbox
          notificationsEnabled={user.notificationsEnabled}
        />
      </CardContent>
    </Card>
  );
}
