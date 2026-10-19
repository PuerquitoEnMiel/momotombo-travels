"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { authService } from "@/services/auth.service";
import {
  gamificationService,
  type GamificationData,
} from "@/services/gamification.service";
import { getAuthToken, clearAuthToken } from "@/lib/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/user";
import { ApiException } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  gamification: GamificationData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  gamification: GamificationData | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
}

// ---------------------------------------------------------------------------
// Shared auth store. A single piece of state + one fetch per auth change,
// consumed by every useAuth() call via useSyncExternalStore. This replaces the
// old per-hook state + double event emission (window event AND listeners array)
// that fired 2-3 /auth/me requests per login/logout.
// ---------------------------------------------------------------------------

let state: AuthState = {
  user: null,
  gamification: null,
  loading: true,
  error: null,
  initialized: false,
};

const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function setState(patch: Partial<AuthState>): void {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AuthState {
  return state;
}

async function loadUserData(): Promise<void> {
  // Single-flight: concurrent callers share one request
  if (inflight) return inflight;

  inflight = (async () => {
    const token = getAuthToken();
    if (!token) {
      setState({
        user: null,
        gamification: null,
        loading: false,
        error: null,
        initialized: true,
      });
      return;
    }

    setState({ loading: true, error: null });

    try {
      // Parallel: avoid the sequential /auth/me -> /gamification/me waterfall
      const [user, gamification] = await Promise.all([
        authService.me(),
        gamificationService.me().catch(() => null),
      ]);
      setState({
        user,
        gamification,
        loading: false,
        error: null,
        initialized: true,
      });
    } catch (error) {
      // Only a real 401 invalidates the session: a transient network failure
      // must never log the user out.
      const isUnauthorized =
        error instanceof ApiException && error.statusCode === 401;
      const message = isUnauthorized
        ? null
        : error instanceof Error
          ? error.message
          : "Auth error";
      if (isUnauthorized) {
        clearAuthToken();
      }
      setState({
        user: null,
        gamification: null,
        loading: false,
        error: message,
        initialized: true,
      });
    }
  })();

  try {
    await inflight;
  } finally {
    inflight = null;
  }
}

export function useAuth(): AuthContextValue {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    // lib/api setAuthToken/clearAuthToken dispatch exactly one "auth-change"
    // event per change — that is the single source of truth.
    const handleChange = () => {
      void loadUserData();
    };
    window.addEventListener("auth-change", handleChange);
    if (!state.initialized) {
      void loadUserData();
    }
    return () => {
      window.removeEventListener("auth-change", handleChange);
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setState({ loading: true, error: null });
    try {
      await authService.login(payload); // setAuthToken dispatches "auth-change"
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setState({ loading: true, error: null });
    try {
      await authService.register(payload);
      setState({ loading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Register failed";
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken(); // dispatches "auth-change" exactly once
  }, []);

  return {
    user: snapshot.user,
    gamification: snapshot.gamification,
    loading: snapshot.loading,
    error: snapshot.error,
    login,
    register,
    logout,
    refresh: loadUserData,
    isAuthenticated: snapshot.user !== null,
  };
}
