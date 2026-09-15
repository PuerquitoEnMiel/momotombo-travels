import { API_URL } from "@/lib/api";
import { api } from "./api";
import type { Booking, CreateBookingPayload } from "@/types/booking";

export const bookingsService = {
  async list(): Promise<Booking[]> {
    return api.get<Booking[]>(`${API_URL}/bookings`);
  },

  async getById(id: string): Promise<Booking> {
    return api.get<Booking>(`${API_URL}/bookings/${id}`);
  },

  async create(payload: CreateBookingPayload): Promise<Booking> {
    return api.post<Booking>(`${API_URL}/bookings`, payload);
  },

  async createCheckoutSession(
    bookingId: string,
    amount: number,
    title: string
  ): Promise<{ url: string; sessionId: string }> {
    return api.post<{ url: string; sessionId: string }>(
      `${API_URL}/stripe/create-checkout-session`,
      { bookingId, amount, title }
    );
  },
};
