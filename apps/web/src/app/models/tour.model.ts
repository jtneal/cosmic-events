export interface Speaker {
  id: string;
  name: string;
  link?: string;
  image?: string;
  biography: string;
}

export interface ItineraryDay {
  id: string;
  title: string;
  image?: string;
  description: string;
  order: number;
}

export interface TourLeg {
  id: string;
  title: string;
  image?: string;
  description: string;
  additionalCost?: number;
  order: number;
  isBefore: boolean; // true for pre-tour, false for post-tour
}

export interface MoreInfoItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface Pricing {
  singleOccupancy?: number;
  doubleOccupancy?: number;
  currency: string;
}

export type TourType = 'tour' | 'conference' | 'meeting' | 'cruise' | 'event';

export type TourStatus = 'draft' | 'published' | 'archived';

export interface Tour {
  id: string;
  title: string;
  subtitle?: string;
  type: TourType;
  description: string;
  speakers: Speaker[];
  itinerary: ItineraryDay[];
  additionalLegs: TourLeg[];
  moreInfo: MoreInfoItem[];
  contactInfo: ContactInfo;
  pricing: Pricing;
  startDate: Date;
  endDate: Date;
  videoLink?: string;
  featuredImage?: string;
  isPromoted: boolean;
  status: TourStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface TourSearchFilters {
  type?: TourType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  promoted?: boolean;
}

export interface TourListResponse {
  tours: Tour[];
  total: number;
  page: number;
  limit: number;
}