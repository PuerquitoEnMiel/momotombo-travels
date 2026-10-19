import { ApiException, type ApiError } from "@/types/api";
import { getAuthToken, clearAuthToken } from "@/lib/api";

const DEFAULT_TIMEOUT = 15000;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeout?: number;
  skipAuth?: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    timeout = DEFAULT_TIMEOUT,
    skipAuth = false,
    headers,
    signal: callerSignal,
    ...rest
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Allow external cancellation (e.g. unmount) without dropping the timeout
  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(endpoint, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const errorBody = (data as ApiError) || {
        statusCode: response.status,
        message: response.statusText || "Request failed",
      };

      // Single-flight session invalidation: only the first 401 clears the
      // token (clearAuthToken dispatches one "auth-change"); parallel 401s
      // find no token and stay quiet.
      if (response.status === 401 && !skipAuth && getAuthToken()) {
        clearAuthToken();
      }

      throw new ApiException(
        errorBody.statusCode || response.status,
        errorBody.message || "Request failed",
        errorBody.details,
      );
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiException) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiException(408, "Request timeout");
    }
    throw new ApiException(
      0,
      error instanceof Error ? error.message : "Network error",
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
