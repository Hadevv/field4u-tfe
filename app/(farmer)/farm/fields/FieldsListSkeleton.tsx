"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FieldsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-48" />
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Skeleton className="mr-1 h-3.5 w-3.5 rounded" />
                <Skeleton className="h-3.5 w-24" />
              </span>
              <span className="flex items-center">
                <Skeleton className="mr-1 h-3.5 w-3.5 rounded" />
                <Skeleton className="h-3.5 w-32" />
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-grow pb-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-48 rounded-full" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
