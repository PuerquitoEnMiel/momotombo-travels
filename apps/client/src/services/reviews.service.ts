import { API_URL } from "@/lib/api";
import { api } from "./api";
import type { Review, CreateReviewPayload } from "@/types/review";

export const reviewsService = {
  async listByDestination(destinationId: string): Promise<Review[]> {
    return api.get<Review[]>(`${API_URL}/reviews/destination/${destinationId}`, { skipAuth: true });
  },

  async create(payload: CreateReviewPayload): Promise<Review> {
    return api.post<Review>(`${API_URL}/reviews`, payload);
  },
};
