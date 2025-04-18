export type Announcement = {
  id: string;
  title: string;
  description: string;
  slug: string;
  images: string[];
  startDate?: Date | null;
  endDate?: Date | null;
  cropType: {
    id: string;
    name: string;
    category: string;
  };
  field: {
    id: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  isPublished: boolean;
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  isLiked?: boolean;
  status?: string;
};

export type MapAnnouncement = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  slug: string;
};

export type CropType = {
  id: string;
  name: string;
};

export type PeriodFilter = "today" | "week" | "month" | "all" | null;

export type SearchFilters = {
  query?: string | null;
  cropTypeId?: string | null;
  location?: string | null;
  radius?: string;
  period?: PeriodFilter;
};

export type FilterBadgeProps = {
  label: string;
  icon?: React.ReactNode;
  onRemove: () => void;
};

export const PERIOD_LABELS: Record<NonNullable<PeriodFilter>, string> = {
  today: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois-ci",
  all: "Toutes périodes",
};

export type LocationFieldProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
};

export type SearchWizardProps = {
  cropTypes: CropType[];
  initialFilters?: SearchFilters;
};

export const getCurrentDate = () => {
  // en prod
  if (process.env.NODE_ENV === "production") {
    return new Date();
  }

  const currentDate = new Date();
  return currentDate;
};

// fonction pour verifier si une date est dans le futur en tenant compte des heures/minutes
export const isFutureDate = (date: Date | null | undefined): boolean => {
  if (!date) return false;
  const now = getCurrentDate();
  return date.getTime() > now.getTime();
};

// fonction pour verifier si une date est passe
export const isPastDate = (date: Date | null | undefined): boolean => {
  if (!date) return false;
  const now = getCurrentDate();
  return date.getTime() < now.getTime();
};

// fonction pour verifier si la date actuelle est entre deux dates
export const isDateBetween = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
): boolean => {
  if (!startDate || !endDate) return false;
  const now = getCurrentDate();
  return (
    startDate.getTime() <= now.getTime() && now.getTime() <= endDate.getTime()
  );
};

export type GleaningStatusInfo = {
  status: string;
  label: string;
  color: string;
  step: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  isCancelled: boolean;
};

export const getGleaningStatusInfo = (
  startDate?: Date | null,
  endDate?: Date | null,
  dbStatus?: string,
): GleaningStatusInfo => {
  const now = getCurrentDate();

  // cas ou le glanage est annulé
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

  // cas ou les dates sont absentes
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

  // glanage terminé
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

  // glanage en cours
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

  // glanage bientot (moins de 24h)
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

  // glanage a venir (plus de 24h)
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
