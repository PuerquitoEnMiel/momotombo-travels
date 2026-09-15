import { API_URL, setAuthToken, clearAuthToken } from "@/lib/api";
import { api } from "./api";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types/user";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${API_URL}/auth/login`, payload, { skipAuth: true });
    if (response.accessToken) {
      setAuthToken(response.accessToken);
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(`${API_URL}/auth/forgot-password`, { email }, { skipAuth: true });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(
      `${API_URL}/auth/reset-password`,
      { token, newPassword },
      { skipAuth: true }
    );
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(
      `${API_URL}/auth/verify-email`,
      { token },
      { skipAuth: true }
    );
  },

  logout(): void {
    clearAuthToken();
  },
};
