export interface Announcement {
  id: string;
  title: string;
  description: string;
  slug: string;
  images: string[];
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
  gleaningPeriods: {
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
  }[];
  isPublished: boolean;
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  isLiked?: boolean;
}

export interface MapAnnouncement {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  slug: string;
}

export interface CropType {
  id: string;
  name: string;
}

export type PeriodFilter = "today" | "week" | "month" | "all" | null;

export interface SearchFilters {
  query?: string | null;
  cropTypeId?: string | null;
  location?: string | null;
  radius?: string;
  period?: PeriodFilter;
}

export interface FilterBadgeProps {
  label: string;
  icon?: React.ReactNode;
  onRemove: () => void;
}

export const PERIOD_LABELS: Record<NonNullable<PeriodFilter>, string> = {
  today: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois-ci",
  all: "Toutes périodes",
};

export interface LocationFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
}

export interface SearchWizardProps {
  cropTypes: CropType[];
  initialFilters?: SearchFilters;
}
