/* Types mirrored from the OmniPush OpenAPI contract (the shapes Stage 1 wires).
 * These are hand-mirrored for the endpoints used now; a fuller generated
 * client can replace this later. Field names match the live /openapi.json. */

export type UserInfo = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  tenant_id?: string | null;
  role?: string | null;
};

export type SignInResponse = {
  timestamp: string;
  request_id?: string | null;
  user: UserInfo;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type RefreshTokenResponse = {
  timestamp: string;
  request_id?: string | null;
  access_token: string;
  expires_in: number;
};

/** A published/draft post row from GET /v1/posts (subset used by the UI). */
export type Post = {
  id: string;
  title?: string | null;
  content?: string | null;
  status?: string | null;
  platforms?: string[] | null;
  scheduled_at?: string | null;
  published_at?: string | null;
  created_at?: string | null;
};

/** News item (Module-1 first approval tier) from /v1/news-items. */
export type NewsItem = {
  id: string;
  title?: string | null;
  content?: string | null;
  moderation_status?: "pending" | "approved" | "rejected" | string | null;
  is_approved?: boolean | null;
  moderation_reason?: string | null;
  created_at?: string | null;
};
