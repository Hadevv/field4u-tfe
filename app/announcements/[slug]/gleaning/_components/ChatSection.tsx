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
import { useState } from "react";
import { toast } from "sonner";

type ChatSectionProps = {
  showChat: boolean;
  participantsCount: number;
};

export function ChatSection({ showChat, participantsCount }: ChatSectionProps) {
  const [groupMessage, setGroupMessage] = useState("");
  const [ownerMessage, setOwnerMessage] = useState("");

  const handleSendGroup = () => {
    if (!groupMessage.trim()) return;
    //TODO: Pusher
    toast.success("message envoyé au groupe");
    setGroupMessage("");
  };

  const handleSendOwner = () => {
    if (!ownerMessage.trim()) return;
    toast.success("message envoyé au propriétaire");
    setOwnerMessage("");
  };

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          discussion
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          communiquez avec les participants et le propriétaire
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showChat ? (
          <Tabs defaultValue="group" className="mb-4">
            <TabsList className="w-full bg-muted">
              <TabsTrigger
                value="group"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Users className="h-4 w-4 mr-2" />
                groupe de glaneurs
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                propriétaire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="group" className="mt-4">
              <div className="h-[300px] overflow-y-auto border rounded-md p-3 mb-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-2 bg-muted/20 rounded-lg text-sm">
                    <p className="font-medium text-xs mb-1 text-foreground">
                      jean dupont
                    </p>
                    <p className="text-foreground">
                      bonjour tout le monde, est-ce que quelqu'un prévoit
                      d'amener des sacs supplémentaires ?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <div className="p-2 bg-muted rounded-lg text-sm">
                    <p className="font-medium text-xs mb-1 text-foreground">
                      vous
                    </p>
                    <p className="text-foreground">
                      j'en apporterai quelques-uns, pas de soucis !
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="écrivez votre message..."
                  value={groupMessage}
                  onChange={(e) => setGroupMessage(e.target.value)}
                  className="bg-background text-foreground border-border"
                  onKeyDown={(e) => e.key === "Enter" && handleSendGroup()}
                />
                <Button
                  className="shrink-0"
                  variant="secondary"
                  onClick={handleSendGroup}
                >
                  <MessageSquareText className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="owner" className="mt-4">
              <div className="h-[300px] overflow-y-auto border rounded-md p-3 mb-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-2 bg-muted/20 rounded-lg text-sm">
                    <p className="font-medium text-xs mb-1 text-foreground">
                      propriétaire
                    </p>
                    <p className="text-foreground">
                      n'hésitez pas à me poser des questions sur les cultures
                      disponibles
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="écrivez au propriétaire..."
                  value={ownerMessage}
                  onChange={(e) => setOwnerMessage(e.target.value)}
                  className="bg-background text-foreground border-border"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOwner()}
                />
                <Button
                  className="shrink-0"
                  variant="secondary"
                  onClick={handleSendOwner}
                >
                  <MessageSquareHeart className="h-4 w-4" />
                </Button>
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
          className="w-full flex items-center justify-center"
        >
          <Users className="h-4 w-4 mr-2" />
          voir les participants ({participantsCount})
        </Button>
      </CardFooter>
    </Card>
  );
}
