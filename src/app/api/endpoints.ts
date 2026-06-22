import { apiRequest } from "./client";
import type {
  SignInResponse, Post, NewsItem,
  DiprStats, CardListResponse, CardListItem, CardDetail,
  CardDraftResponse, ApprovalActionResponse,
  CreateDraftBody, ApproveCardBody, AIRefineResponse,
  SaveDesignBody, DesignResponse,
} from "./types";

/* Auth */
export function signIn(email: string, password: string) {
  return apiRequest<SignInResponse>("/auth/signin", {
    method: "POST",
    body: { email, password },
    anon: true,
  });
}

export function signOut() {
  return apiRequest<unknown>("/auth/signout", { method: "POST" });
}

/* Posts (legacy) */
export function listPosts(params?: { page?: number; limit?: number; status?: string }) {
  return apiRequest<{ posts?: Post[]; data?: Post[]; items?: Post[] }>("/posts", { query: params });
}

/* News items (legacy) */
export function listNewsItems(params?: { status?: string }) {
  return apiRequest<{ news_items?: NewsItem[]; data?: NewsItem[]; items?: NewsItem[] }>("/news-items", { query: params });
}

export function moderateNewsItem(id: string, status: "approved" | "rejected", reason?: string) {
  return apiRequest<NewsItem>(`/news-items/${id}/moderation`, {
    method: "PATCH",
    body: { moderation_status: status, moderation_reason: reason },
  });
}

/* Dashboard */
export function diprStats() {
  return apiRequest<DiprStats>("/dashboard/dipr-stats");
}

/* Cards */
export function listCards(params?: { status?: string; page?: number; page_size?: number }) {
  return apiRequest<CardListResponse>("/cards", { query: params });
}

export function getCard(id: string) {
  return apiRequest<CardDetail>(`/cards/${id}`);
}

export function createDraft(body: CreateDraftBody) {
  return apiRequest<CardDraftResponse>("/cards/draft", { method: "POST", body });
}

export function updateDraft(id: string, body: Partial<CreateDraftBody>) {
  return apiRequest<CardDetail>(`/cards/${id}`, { method: "PATCH", body });
}

export function aiRefineCard(id: string) {
  return apiRequest<AIRefineResponse>(`/cards/${id}/ai-refine`, { method: "POST" });
}

export function designCard(id: string, body: SaveDesignBody) {
  return apiRequest<DesignResponse>(`/cards/${id}/design`, { method: "POST", body });
}

export function submitCard(id: string) {
  return apiRequest<{ card_id: string; status: string; message: string }>(`/cards/${id}/submit`, { method: "POST" });
}

export function approveCard(id: string, body: ApproveCardBody) {
  return apiRequest<ApprovalActionResponse>(`/cards/${id}/approve`, { method: "PATCH", body });
}

export function returnCard(id: string, comment: string) {
  return apiRequest<ApprovalActionResponse>(`/cards/${id}/return`, { method: "POST", body: { comment } });
}

export function rejectCard(id: string, comment: string) {
  return apiRequest<ApprovalActionResponse>(`/cards/${id}/reject`, { method: "POST", body: { comment } });
}

// Kept for backwards compat with existing components
export { type CardListItem, type CardDetail };

/* Dashboard stats (generic) */
export function dashboardStats() {
  return apiRequest<Record<string, unknown>>("/dashboard/stats");
}
