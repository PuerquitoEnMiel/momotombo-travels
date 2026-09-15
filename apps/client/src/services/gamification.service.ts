import { API_URL } from "@/lib/api";
import { api } from "./api";

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export interface GamificationData {
  points: number;
  earnedBadges: Badge[];
  availableBadges: Badge[];
  nextLevelThreshold: number;
  level?: number;
}

export const gamificationService = {
  async me(): Promise<GamificationData> {
    return api.get<GamificationData>(`${API_URL}/gamification/me`);
  },
};
