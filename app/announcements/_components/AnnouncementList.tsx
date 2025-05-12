"use client";

import { AnnouncementCard } from "./AnnouncementCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Announcement } from "@/types/announcement";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import Link from "next/link";

type AnnouncementListProps = {
  announcements: Announcement[];
};

function EmptyState() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-muted/40 rounded-full p-3 mb-4">
        <Search className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-lg font-medium mb-2">Aucune annonce trouvée</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Aucune annonce ne correspond à vos critères de recherche. Essayez
        d'ajuster vos filtres ou de réinitialiser votre recherche.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          asChild
          size="sm"
          className="flex items-center gap-2"
        >
          <Link href="/announcements">
            <RefreshCw className="h-4 w-4" />
            Réinitialiser les filtres
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-3 p-2">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            isLiked={announcement.isLiked}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
