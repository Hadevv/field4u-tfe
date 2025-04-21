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
  likeCount?: number;
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
