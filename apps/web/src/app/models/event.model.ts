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

export interface EventLeg {
  id: string;
  title: string;
  image?: string;
  description: string;
  additionalCost?: number;
  order: number;
  isBefore: boolean; // true for pre-event, false for post-event
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

export type EventType = 'event' | 'conference' | 'meeting' | 'cruise' | 'event';

export type EventStatus = 'draft' | 'published' | 'archived';

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  type: EventType;
  description: string;
  speakers: Speaker[];
  itinerary: ItineraryDay[];
  additionalLegs: EventLeg[];
  moreInfo: MoreInfoItem[];
  contactInfo: ContactInfo;
  pricing: Pricing;
  startDate: Date;
  endDate: Date;
  videoLink?: string;
  featuredImage?: string;
  isPromoted: boolean;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface EventSearchFilters {
  type?: EventType;
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

export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}