export interface ItineraryItem {
  id: string;
  itineraryDayId: string;
  activityId?: string;
  customTitle?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  order?: number;
  cost?: number;
  activity?: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    duration?: number;
  };
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date?: string;
  items: ItineraryItem[];
}

export type ItineraryStatus = "DRAFT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  status: ItineraryStatus;
  days: ItineraryDay[];
}

export interface CreateItineraryPayload {
  title: string;
  startDate?: string;
  endDate?: string;
}

export interface ReorderItemsPayload {
  dayId: string;
  itemIds: string[];
}
