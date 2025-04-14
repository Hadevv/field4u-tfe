import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementLoading() {
  return (
    <div className="rounded-lg p-6 shadow-sm">
      {/* statut de l'annonce */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* titre et auteur */}
      <div className="flex justify-between mb-2">
        <div>
          <Skeleton className="h-4 w-36 mb-1" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-5 w-32" />
      </div>

      {/* description et images */}
      <div className="flex mt-6 gap-8">
        <div className="w-1/2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* information */}
          <div className="mt-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-full mr-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* image */}
        <div className="w-1/2 relative">
          <Skeleton className="h-[320px] rounded-lg w-full" />
          {/* vignette */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* boutons d'action */}
      <div className="flex justify-between items-center w-full mt-8">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>
    </div>
  );
}
