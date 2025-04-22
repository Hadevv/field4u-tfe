import { Layout, LayoutContent } from "@/features/page/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Layout size="full">
      <LayoutContent>
        <div className="space-y-6 w-full">
          <div className="border rounded-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center w-full sm:w-80 space-x-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-10 flex-shrink-0" />
                </div>
                <Skeleton className="h-9 w-[180px]" />
              </div>
            </div>
            <div className="rounded-md border">
              <div className="p-1">
                <div className="h-10 flex bg-muted/50 rounded-md">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="flex-1 h-6 mx-3 mt-2"
                      style={{ opacity: 0.7 - i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="mt-2 space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 flex items-center rounded-md hover:bg-accent/5"
                    >
                      {Array.from({ length: 8 }).map((_, j) => (
                        <Skeleton
                          key={j}
                          className="flex-1 h-6 mx-3"
                          style={{ opacity: 0.6 - j * 0.05 }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
