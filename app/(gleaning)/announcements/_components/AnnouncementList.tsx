"use client";

import { AnnouncementCard } from "./AnnouncementCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Announcement } from "./types";
import { Button } from "@/components/ui/button";
import { CircleSlash, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

interface AnnouncementListProps {
  announcements: Announcement[];
}

// Composant pour afficher un état vide
function EmptyState() {
  return (
    <div className="h-[calc(100vh-15rem)] flex flex-col items-center justify-center p-8 text-center">
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
          onClick={() => (window.location.href = "/announcements")}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Réinitialiser les filtres
        </Button>
        <Button asChild>
          <Link href="/map">Explorer la carte</Link>
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
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-4 p-4">
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
