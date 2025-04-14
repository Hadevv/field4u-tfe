"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List } from "lucide-react";
import React from "react";

type AnnouncementTabsProps = {
  listContent: React.ReactNode;
  mapContent: React.ReactNode;
};

export function AnnouncementTabs({
  listContent,
  mapContent,
}: AnnouncementTabsProps) {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list" className="flex items-center gap-1">
          <List className="size-4" />
          Liste
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-1">
          <Map className="size-4" />
          Carte
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="mt-2">
        {listContent}
      </TabsContent>
      <TabsContent value="map" className="mt-2">
        {mapContent}
      </TabsContent>
    </Tabs>
  );
}
