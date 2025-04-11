import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function AnnouncementCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white mb-4 rounded-lg">
      <div className="flex">
        <Skeleton className="w-[180px] min-w-[180px] h-[160px]" />
        <div className="flex-1 p-4 relative">
          <div className="absolute top-3 right-3">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <div className="mb-3 pr-10">
            <Skeleton className="h-4 w-36 mb-1" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-1 mb-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-1.5 mt-auto">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-52" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
function SearchWizardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}
function AnnouncementListSkeleton() {
  return (
    <div className="space-y-4 overflow-auto max-h-[calc(100vh-14rem)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <AnnouncementCardSkeleton key={index} />
      ))}
    </div>
  );
}
function AnnouncementMapSkeleton() {
  return <Skeleton className="h-[calc(100vh-12rem)] w-full rounded-lg" />;
}
function AnnouncementTabsSkeleton() {
  return (
    <div className="md:hidden mt-2">
      <div className="flex border-b">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32 ml-4" />
      </div>
      <div className="pt-2">
        <AnnouncementListSkeleton />
      </div>
    </div>
  );
}

export default function AnnouncementsLoading() {
  return (
    <div className="container mx-auto pt-4">
      <SearchWizardSkeleton />
      <AnnouncementTabsSkeleton />
      <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-6 lg:col-span-5">
          <AnnouncementListSkeleton />
        </div>
        <div className="md:col-span-6 lg:col-span-7">
          <AnnouncementMapSkeleton />
        </div>
      </div>
    </div>
  );
}
