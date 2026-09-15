export type PriceLevel = "FREE" | "LOW" | "MEDIUM" | "HIGH" | "LUXURY";

import type { Review } from "./review";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface DestinationImage {
  id: string;
  url: string;
  altText?: string;
  isHero: boolean;
  destinationId: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration?: number;
  price: number;
  destinationId: string;
  providerId?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceLevel: PriceLevel;
  rating: number;
  location?: Record<string, unknown>;
  category: Category;
  images: DestinationImage[];
  activities?: Activity[];
  amenities?: Amenity[];
  reviews?: Review[];
}

export interface DestinationSearchPayload {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}
