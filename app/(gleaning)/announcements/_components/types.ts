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
