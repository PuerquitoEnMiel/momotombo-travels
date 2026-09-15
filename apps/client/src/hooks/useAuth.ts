"use client";

import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { gamificationService, type GamificationData } from "@/services/gamification.service";
import { getAuthToken, clearAuthToken } from "@/lib/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/user";
import { ApiException } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  gamification: GamificationData | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
}

let listeners: Array<() => void> = [];

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth-change"));
  listeners.forEach((l) => l());
}

export function useAuth(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    user: null,
    gamification: null,
    loading: true,
    error: null,
  });

  const loadUserData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setState({ user: null, gamification: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const user = await authService.me();
      let gamification: GamificationData | null = null;
      try {
        gamification = await gamificationService.me();
      } catch {
        gamification = null;
      }
      setState({ user, gamification, loading: false, error: null });
    } catch (error) {
      const message =
        error instanceof ApiException && error.statusCode === 401
          ? null
          : error instanceof Error
            ? error.message
            : "Auth error";
      clearAuthToken();
      setState({ user: null, gamification: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    const handleChange = () => {
      void loadUserData();
    };

    window.addEventListener("auth-change", handleChange);
    listeners.push(handleChange);
    void loadUserData();

    return () => {
      window.removeEventListener("auth-change", handleChange);
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, [loadUserData]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await authService.login(payload);
        emitAuthChange();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        throw error;
      }
    },
    []
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authService.register(payload);
      setState((prev) => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register failed";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    emitAuthChange();
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refresh: loadUserData,
    isAuthenticated: state.user !== null,
  };
}
