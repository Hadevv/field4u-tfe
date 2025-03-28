"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nouveau champ disponible",
      description:
        "Un nouveau champ de carottes est disponible près de chez vous.",
      date: "Il y a 2 heures",
      read: false,
    },
    {
      id: "2",
      title: "Rappel de glanage",
      description:
        "Votre session de glanage à la Ferme des Champs Libres est demain.",
      date: "Il y a 5 heures",
      read: false,
    },
    {
      id: "3",
      title: "Nouvelle inscription",
      description: "3 personnes se sont inscrites à votre annonce de glanage.",
      date: "Hier",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between px-4 pb-2 pt-4">
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Vos dernières notifications</CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                Tout marquer comme lu
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-[400px] divide-y overflow-auto p-0">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-muted/50 ${notification.read ? "opacity-70" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {notification.title}
                      {!notification.read && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {notification.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Aucune notification
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t p-2">
            <Button variant="link" size="sm" className="text-xs">
              Voir toutes les notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
