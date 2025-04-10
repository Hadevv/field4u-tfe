"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnnouncementsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <CardDescription className="flex flex-wrap gap-2 mt-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow pb-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
