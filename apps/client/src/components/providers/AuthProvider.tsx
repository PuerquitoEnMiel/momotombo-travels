"use client";

import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  useAuth();
  return <>{children}</>;
}
