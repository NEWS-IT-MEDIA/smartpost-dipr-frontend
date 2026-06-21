/* API configuration for the OmniPush backend.
 * Base URL comes from VITE_API_BASE_URL; defaults to local dev. */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

/** All authenticated OmniPush routes live under /v1. */
export const API_V1 = `${API_BASE_URL}/v1`;

/* localStorage keys for the prototype session.
 * NOTE: for production move the access token to an httpOnly cookie (XSS-safe).
 * Acceptable here for Phase-1 dev against the sandbox backend. */
export const STORAGE = {
  accessToken: "dipr_access_token",
  refreshToken: "dipr_refresh_token",
  tenantId: "dipr_tenant_id",
  user: "dipr_user",
} as const;
