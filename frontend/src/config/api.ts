const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  signIn: "/api/auth/sign-in",
  checkToken: "/api/user-tokens/check-token",
} as const;
