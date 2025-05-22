import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { ParticipationsList } from "./_components/ParticipationsList";
import { FavoritesList } from "./_components/FavoritesList";
import { LikesList } from "./_components/LikesList";
import { ReviewsList } from "./_components/ReviewsList";
import { requiredAuth } from "@/lib/auth/helper";
export const metadata: Metadata = {
  title: "mes glanages | field4u",
  description: "gérer vos participations, favoris et évaluations",
};

export default async function MyGleaningsPage() {
  const user = await requiredAuth();
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Mes glanages</h1>
        <p className="text-muted-foreground">
          gérer vos participations, favoris et évaluations
        </p>
      </div>

      <Tabs defaultValue="participations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="participations">participations</TabsTrigger>
          <TabsTrigger value="favorites">favoris</TabsTrigger>
          <TabsTrigger value="likes">j'aime</TabsTrigger>
          <TabsTrigger value="reviews">évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="participations">
          <Suspense
            fallback={
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
            }
          >
            <ParticipationsList userId={user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="favorites">
          <Suspense
            fallback={
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
            }
          >
            <FavoritesList userId={user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="likes">
          <Suspense
            fallback={
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
            }
          >
            <LikesList userId={user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="reviews">
          <Suspense
            fallback={
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
            }
          >
            <ReviewsList userId={user.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
