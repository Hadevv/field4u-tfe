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
import { useNotifications } from "@/hooks/useNotifications";
import { useSession } from "next-auth/react";

export function NotificationsMenu() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
  } = useNotifications(userId);

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
              <CardDescription>vos dernières notifications</CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                tout marquer comme lu
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-[400px] divide-y overflow-auto p-0">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-muted/50 ${notification.isRead ? "opacity-70" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {notification.type}
                      {!notification.isRead && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                aucune notification
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t p-2">
            <Button variant="link" size="sm" className="text-xs">
              voir toutes les notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
