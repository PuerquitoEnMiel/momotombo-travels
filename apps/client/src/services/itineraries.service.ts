import { API_URL } from "@/lib/api";
import { api } from "./api";
import type { Itinerary, CreateItineraryPayload, ReorderItemsPayload } from "@/types/itinerary";

export const itinerariesService = {
  async list(): Promise<Itinerary[]> {
    return api.get<Itinerary[]>(`${API_URL}/itineraries`);
  },

  async getById(id: string): Promise<Itinerary> {
    return api.get<Itinerary>(`${API_URL}/itineraries/${id}`);
  },

  async create(payload: CreateItineraryPayload): Promise<Itinerary> {
    return api.post<Itinerary>(`${API_URL}/itineraries`, payload);
  },

  async reorderItems(itineraryId: string, payload: ReorderItemsPayload): Promise<Itinerary> {
    return api.post<Itinerary>(`${API_URL}/itineraries/${itineraryId}/items/reorder`, payload);
  },
};
