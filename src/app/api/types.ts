/* Types mirrored from the OmniPush OpenAPI contract.
 * All fields are camelCase — the backend BaseResponse uses alias_generator=to_camel. */

export type UserInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId?: string | null;
  role?: string | null;
  roleDisplay?: string | null;
  newsroomRole?: string | null;
  district?: string | null;
  department?: string | null;
};

export type SignInResponse = {
  timestamp: string;
  requestId?: string | null;
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type RefreshTokenResponse = {
  timestamp: string;
  requestId?: string | null;
  accessToken: string;
  expiresIn: number;
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
