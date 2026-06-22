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

// ─── DIPR Dashboard ─────────────────────────────────────────────────────────
// Response model is Dict[str, Any] so keys remain snake_case as returned by Python.
export type SentimentDay = { day: string; positive: number; neutral: number; negative: number };
export type TaskItem = { text: string; type: string; card_id?: string };
export type AlertItem = { id: string; type: string; platform: string; keyword: string; count: number; spike_pct: number; triggered_at: string };

export type DiprStats = {
  cards_pending: number;
  cards_overdue: number;
  published_today: number;
  published_today_delta: number;
  negative_mentions_today: number;
  negative_spike_alerts: number;
  print_items_today: number;
  print_front_page_today: number;
  sentiment_7d: SentimentDay[];
  my_tasks: TaskItem[];
  live_alerts: AlertItem[];
  print_digest_preview: Record<string, number>;
  lastUpdated: string;
};

// ─── DIPR Cards — all response fields are camelCase (models use _CAMEL) ─────
export type CardListItem = {
  id: string;
  titleTa?: string | null;
  titleEn?: string | null;
  status: string;
  tonality?: string | null;
  currentApprovalStage: number;
  createdAt: string;
  updatedAt: string;
};

export type CardListResponse = {
  items: CardListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type CardDetail = {
  id: string;
  titleTa?: string | null;
  titleEn?: string | null;
  bodyText?: string | null;
  keyFacts: string[];
  sourceRef?: string | null;
  eventDate?: string | null;
  location?: string | null;
  tonality?: string | null;
  status: string;
  currentApprovalStage: number;
  approvalChain: unknown[];
  aiRefinedTa?: string | null;
  aiRefinedEn?: string | null;
  groundingTa: unknown[];
  groundingEn: unknown[];
  moderationFlags: Array<{ type: string; location: string; suggestion: string; severity: string }>;
  captionVariants: Array<{ id: number; text: string }>;
  designTemplate?: string | null;
  platformCardUrls: Record<string, string>;
  publishMetadata: Record<string, unknown>;
  publishedAt?: string | null;
  recalledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CardDraftResponse = {
  cardId: string;
  status: string;
  createdAt: string;
};

export type ApprovalActionResponse = {
  cardId: string;
  action: string;
  newStatus: string;
  stage: number;
  message: string;
};

// Request bodies (snake_case — these are plain BaseModel, no alias_generator)
export type CreateDraftBody = {
  title_ta?: string;
  title_en?: string;
  body_ta?: string;
  body_en?: string;
  key_facts?: string[];
  go_reference?: string;
  event_date?: string;
  location?: string;
  tonality?: string;
};

export type ApproveCardBody = {
  action: "approve" | "approve_with_edits" | "return" | "reject";
  comment?: string;
};
