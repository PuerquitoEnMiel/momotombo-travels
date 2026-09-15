"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "@/services/api";
import { ApiException } from "@/types/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T, P extends unknown[]> extends UseApiState<T> {
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, P extends unknown[] = []>(
  endpoint: string | ((...args: P) => string),
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET"
): UseApiResult<T, P> {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: false, error: null });
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      const url = typeof endpoint === "function" ? endpoint(...args) : endpoint;
      setState({ data: null, loading: true, error: null });

      try {
        const fetcher = api[method.toLowerCase() as "get" | "post" | "put" | "patch" | "delete"];
        const data = await fetcher<T>(url);
        if (isMounted.current) {
          setState({ data, loading: false, error: null });
        }
        return data;
      } catch (error) {
        const message = error instanceof ApiException ? error.message : error instanceof Error ? error.message : "Unknown error";
        if (isMounted.current) {
          setState({ data: null, loading: false, error: message });
        }
        return null;
      }
    },
    [endpoint, method]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
