"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  MessageSquare,
  MessageSquareHeart,
  MessageSquareText,
  User as UserIcon,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { sendMessageAction } from "../_actions/send-message.action";
import { pusherClient } from "@/lib/pusher/pusher-client";
import { LoadingButton } from "@/features/form/SubmitButton";

type MessageType = {
  id: string;
  senderId: string;
  senderName: string | null;
  type: "GROUP" | "OWNER";
  content: string;
  createdAt: string;
};

type ChatSectionProps = {
  showChat: boolean;
  participantsCount: number;
  gleaningId: string;
  userId: string;
  userName: string | null;
  messages: MessageType[];
};

export function ChatSection({
  showChat,
  participantsCount,
  gleaningId,
  userId,
  userName,
  messages: initialMessages,
  gleaningStatus,
}: ChatSectionProps & { gleaningStatus?: string }) {
  const [groupMessage, setGroupMessage] = useState("");
  const [ownerMessage, setOwnerMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<"group" | "owner">("group");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`gleaning-${gleaningId}`);
    const handler = (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
    };
    channel.bind("new-message", handler);
    return () => {
      channel.unbind("new-message", handler);
      pusherClient.unsubscribe(`gleaning-${gleaningId}`);
    };
  }, [gleaningId]);

  const mutation = useMutation({
    mutationFn: async (data: { type: "GROUP" | "OWNER"; content: string }) =>
      resolveActionResult(
        sendMessageAction({
          gleaningId,
          type: data.type,
          content: data.content,
        }),
      ),
    onError: (error: { message?: string }) => {
      toast.error(error.message || "erreur d'envoi");
    },
    onSuccess: (message) => {
      toast.success("message envoyé");
      setGroupMessage("");
      setOwnerMessage("");
      if (message) {
        const newMessage: MessageType = {
          id: message.id,
          senderId: message.senderId,
          senderName: message.sender?.name ?? userName ?? null,
          type: message.type,
          content: message.content,
          createdAt:
            typeof message.createdAt === "string"
              ? message.createdAt
              : new Date(message.createdAt).toISOString(),
        };
        setMessages((prev) =>
          prev.some((m) => m.id === newMessage.id)
            ? prev
            : [...prev, newMessage],
        );
      }
    },
  });

  if (gleaningStatus === "COMPLETED" || gleaningStatus === "CANCELLED") {
    return (
      <Card className="overflow-hidden border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <MessageSquare className="h-5 w-5" />
            discussion
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            le chat est fermé car le glanage est terminé
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <MessageSquare className="h-5 w-5" />
          discussion
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          communiquez avec les participants et le propriétaire
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showChat ? (
          <Tabs
            defaultValue="group"
            className="mb-4"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "group" | "owner")}
          >
            <TabsList className="w-full bg-muted">
              <TabsTrigger
                value="group"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Users className="h-5 w-5 mr-2" />
                groupe de glaneurs
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                propriétaire
              </TabsTrigger>
            </TabsList>
            <TabsContent value="group" className="mt-4">
              <div className="h-[300px] overflow-y-auto border rounded-md p-3 mb-4 space-y-3">
                {messages
                  .filter((m) => m.type === "GROUP")
                  .map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.senderId === userId
                          ? "flex items-start gap-2 justify-end"
                          : "flex items-start gap-2"
                      }
                    >
                      {m.senderId !== userId && (
                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className={
                          m.senderId === userId
                            ? "p-2 bg-muted rounded-lg text-sm"
                            : "p-2 bg-muted/20 rounded-lg text-sm"
                        }
                      >
                        <p className="font-medium text-xs mb-1 text-foreground">
                          {m.senderId === userId
                            ? "vous"
                            : m.senderName || "utilisateur"}
                        </p>
                        <p className="text-foreground">{m.content}</p>
                        <span className="block text-xs text-muted-foreground mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {m.senderId === userId && (
                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="écrivez votre message..."
                  value={groupMessage}
                  onChange={(e) => setGroupMessage(e.target.value)}
                  className="bg-background text-foreground border-border"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    groupMessage.trim() &&
                    mutation.mutate({ type: "GROUP", content: groupMessage })
                  }
                  disabled={mutation.isPending}
                />
                <LoadingButton
                  className="shrink-0"
                  variant="secondary"
                  onClick={() =>
                    groupMessage.trim() &&
                    mutation.mutate({ type: "GROUP", content: groupMessage })
                  }
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                >
                  <MessageSquareText className="h-4 w-4" />
                </LoadingButton>
              </div>
            </TabsContent>
            <TabsContent value="owner" className="mt-4">
              <div className="h-[300px] overflow-y-auto border rounded-md p-3 mb-4 space-y-3">
                {messages
                  .filter((m) => m.type === "OWNER")
                  .map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.senderId === userId
                          ? "flex items-start gap-2 justify-end"
                          : "flex items-start gap-2"
                      }
                    >
                      {m.senderId !== userId && (
                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className={
                          m.senderId === userId
                            ? "p-2 bg-muted rounded-lg text-sm"
                            : "p-2 bg-muted/20 rounded-lg text-sm"
                        }
                      >
                        <p className="font-medium text-xs mb-1 text-foreground">
                          {m.senderId === userId
                            ? "vous"
                            : m.senderName || "utilisateur"}
                        </p>
                        <p className="text-foreground">{m.content}</p>
                        <span className="block text-xs text-muted-foreground mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {m.senderId === userId && (
                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="écrivez au propriétaire..."
                  value={ownerMessage}
                  onChange={(e) => setOwnerMessage(e.target.value)}
                  className="bg-background text-foreground border-border"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    ownerMessage.trim() &&
                    mutation.mutate({ type: "OWNER", content: ownerMessage })
                  }
                  disabled={mutation.isPending}
                />
                <LoadingButton
                  className="shrink-0"
                  variant="secondary"
                  onClick={() =>
                    ownerMessage.trim() &&
                    mutation.mutate({ type: "OWNER", content: ownerMessage })
                  }
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                >
                  <MessageSquareHeart className="h-4 w-4" />
                </LoadingButton>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6 text-center space-y-4 bg-muted/20 rounded-lg">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium mb-1 text-foreground">
                chat non disponible
              </p>
              <p className="text-sm text-muted-foreground">
                le chat sera disponible 24h avant le début du glanage
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          size="sm"
          className="w-full flex items-center justify-center"
        >
          <Users className="h-5 w-5 mr-2" />
          nombre de participants ({participantsCount})
        </Button>
      </CardFooter>
    </Card>
  );
}
