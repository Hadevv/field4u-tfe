import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
  LayoutActions,
} from "@/features/page/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>détails du glanage</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gleanings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            retour aux glanages
          </Link>
        </Button>
      </LayoutActions>
      <LayoutContent>
        <div className="space-y-6">
          <div className="border rounded-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-1/3 mb-6" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div className="space-y-1.5 w-full">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-1 w-full">
            <div className="flex gap-1 mb-4 border-b">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <div className="rounded-md border">
                <div className="p-1">
                  <div className="h-10 flex bg-muted/50 rounded-md">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="flex-1 h-6 mx-3 mt-2"
                        style={{ opacity: 0.7 - i * 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 space-y-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 flex items-center rounded-md hover:bg-accent/5"
                      >
                        {Array.from({ length: 4 }).map((_, j) => (
                          <Skeleton
                            key={j}
                            className="flex-1 h-6 mx-3"
                            style={{ opacity: 0.6 - j * 0.1 }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
