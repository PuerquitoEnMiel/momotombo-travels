import { API_URL } from "@/lib/api";
import { api } from "./api";
import type { Destination } from "@/types/destination";

export interface AiSearchResponse {
  destinations: Destination[];
  summary: string;
}

export const destinationsService = {
  async list(categorySlug?: string): Promise<Destination[]> {
    const endpoint = categorySlug
      ? `${API_URL}/destinations?category=${encodeURIComponent(categorySlug)}`
      : `${API_URL}/destinations`;
    return api.get<Destination[]>(endpoint, { skipAuth: true });
  },

  async getBySlug(slug: string): Promise<Destination> {
    return api.get<Destination>(`${API_URL}/destinations/${encodeURIComponent(slug)}`, { skipAuth: true });
  },

  async aiSearch(query: string): Promise<AiSearchResponse> {
    return api.get<AiSearchResponse>(
      `${API_URL}/gemini-agent/ai-search?q=${encodeURIComponent(query)}`,
      { skipAuth: true }
    );
  },
};
