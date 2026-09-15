import { API_URL } from "@/lib/api";
import { api } from "./api";
import type { BlogPost } from "@/types/blog";

export const blogsService = {
  async list(): Promise<BlogPost[]> {
    return api.get<BlogPost[]>(`${API_URL}/blogs`, { skipAuth: true });
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    return api.get<BlogPost>(`${API_URL}/blogs/${encodeURIComponent(slug)}`, { skipAuth: true });
  },
};
