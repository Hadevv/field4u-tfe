import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementLoading() {
  return (
    <div className="flex flex-col gap-6 shadow-sm rounded-lg p-4 sm:p-6">
      <div className="w-full">
        <div className="rounded-lg p-4 sm:p-6 shadow-sm">
          {/* statut de l'annonce */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* section principale */}
          <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
            <div>
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>

          {/* description et images */}
          <div className="flex flex-col md:flex-row mt-4 md:mt-6 gap-4 md:gap-8">
            {/* image section */}
            <div className="w-full md:w-1/2 md:order-2 relative mb-4 md:mb-0">
              <Skeleton className="h-[220px] sm:h-[280px] md:h-[320px] rounded-lg w-full" />
            </div>

            {/* description et infos */}
            <div className="w-full md:w-1/2 md:order-1">
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* information section */}
              <div className="mt-4 md:mt-8">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-6 gap-4">
            <Skeleton className="h-10 w-full sm:w-36" />
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
