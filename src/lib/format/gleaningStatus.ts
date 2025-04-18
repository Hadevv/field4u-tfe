import { getCurrentDate, isPastDate, isDateBetween } from "@/lib/format/date";

export const getGleaningStatusInfo = (
  startDate?: Date | null,
  endDate?: Date | null,
  dbStatus?: string,
) => {
  const now = getCurrentDate();

  if (dbStatus === "CANCELLED") {
    return {
      status: "CANCELLED",
      label: "annulé",
      color: "bg-red-100 text-red-800",
      step: 0,
      isPast: false,
      isCurrent: false,
      isFuture: false,
      isCancelled: true,
    };
  }

  if (!startDate || !endDate) {
    return {
      status: "NOT_STARTED",
      label: "indisponible",
      color: "bg-gray-100 text-gray-800",
      step: 0,
      isPast: false,
      isCurrent: false,
      isFuture: false,
      isCancelled: false,
    };
  }

  if (isPastDate(endDate)) {
    return {
      status: "COMPLETED",
      label: "terminé",
      color: "bg-blue-100 text-blue-800",
      step: 3,
      isPast: true,
      isCurrent: false,
      isFuture: false,
      isCancelled: false,
    };
  }

  if (isDateBetween(startDate, endDate)) {
    return {
      status: "IN_PROGRESS",
      label: "en cours",
      color: "bg-green-100 text-green-800",
      step: 2,
      isPast: false,
      isCurrent: true,
      isFuture: false,
      isCancelled: false,
    };
  }

  const oneDayBefore = new Date(startDate);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);

  if (now >= oneDayBefore) {
    return {
      status: "NOT_STARTED",
      label: "bientôt",
      color: "bg-yellow-100 text-yellow-800",
      step: 1,
      isPast: false,
      isCurrent: false,
      isFuture: true,
      isCancelled: false,
    };
  }

  return {
    status: "NOT_STARTED",
    label: "à venir",
    color: "bg-indigo-100 text-indigo-800",
    step: 0,
    isPast: false,
    isCurrent: false,
    isFuture: true,
    isCancelled: false,
  };
};
