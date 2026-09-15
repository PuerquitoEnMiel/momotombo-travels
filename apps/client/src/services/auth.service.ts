import { API_URL, setAuthToken, clearAuthToken } from "@/lib/api";
import { api } from "./api";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types/user";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${API_URL}/auth/login`, payload, { skipAuth: true });
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    return response;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${API_URL}/auth/register`, payload, { skipAuth: true });
    return response;
  },

  async me(): Promise<AuthUser> {
    return api.get<AuthUser>(`${API_URL}/auth/me`);
  },

  logout(): void {
    clearAuthToken();
  },
};
