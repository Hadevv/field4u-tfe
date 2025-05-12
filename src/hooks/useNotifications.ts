"use client";

import { useEffect, useState, useCallback } from "react";
import { pusherClient } from "@/lib/pusher/pusher-client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type NotificationType = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();

  // charger les notifs
  const { data } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return { data: [], meta: { unreadCount: 0 } };
      const res = await fetch(`/api/v1/notifications?limit=20`);
      return res.json();
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      setNotifications(data.data || []);
      setUnreadCount(data.meta?.unreadCount || 0);
    }
  }, [data]);

  // abonner pusher
  useEffect(() => {
    if (!userId) return;
    const channel = pusherClient.subscribe(`private-user-${userId}`);

    channel.bind("notification:new", (notif: NotificationType) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
      toast(notif.message);
      // stop cache
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    });
    channel.bind("notification:read", (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      // stop cache
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    });
    channel.bind("notification:allRead", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      // stop cache
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    });

    return () => {
      pusherClient.unsubscribe(`private-user-${userId}`);
    };
  }, [userId, queryClient]);

  // helpers
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/v1/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return fetch(`/api/v1/notifications`, { method: "PUT" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const markAsRead = useCallback(
    async (id: string) => {
      await markAsReadMutation.mutateAsync(id);
    },
    [markAsReadMutation],
  );

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
