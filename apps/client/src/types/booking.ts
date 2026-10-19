export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED";

export interface Booking {
  id: string;
  userId: string;
  activityId: string;
  date: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  activity?: {
    id: string;
    name: string;
    price?: number;
    imageUrl?: string;
    durationHours?: number;
  };
  user?: {
    name?: string;
    email?: string;
  };
}

export interface CreateBookingPayload {
  activityId: string;
  date: string;
  guests: number;
  totalPrice?: number;
}
