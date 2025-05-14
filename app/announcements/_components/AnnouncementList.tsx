"use client";

import { AnnouncementCard } from "./AnnouncementCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Announcement } from "@/types/announcement";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AnnouncementListProps = {
  announcements: Announcement[];
  onHighlightAnnouncement?: (id: string | null) => void;
  highlightedAnnouncementId?: string | null;
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

export function AnnouncementList({
  announcements,
  onHighlightAnnouncement,
  highlightedAnnouncementId,
}: AnnouncementListProps) {
  const [hoveredAnnouncementId, setHoveredAnnouncementId] = useState<
    string | null
  >(null);

  // si une annonce est survolée, on informe le parent
  const handleHighlightAnnouncement = (id: string) => {
    setHoveredAnnouncementId(id);
    if (onHighlightAnnouncement) {
      onHighlightAnnouncement(id);
    }
  };

  const handleUnhighlightAnnouncement = () => {
    setHoveredAnnouncementId(null);
    if (onHighlightAnnouncement) {
      onHighlightAnnouncement(null);
    }
  };

  if (announcements.length === 0) {
    return <EmptyState />;
  }

  // utiliser l'id survolé en priorité, sinon celui du parent
  const effectiveHighlightedId =
    hoveredAnnouncementId || highlightedAnnouncementId;

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-3 p-2">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            isLiked={announcement.isLiked}
            onHighlight={handleHighlightAnnouncement}
            onUnhighlight={handleUnhighlightAnnouncement}
            isHighlighted={effectiveHighlightedId === announcement.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
