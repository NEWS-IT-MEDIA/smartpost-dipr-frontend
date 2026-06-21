import { apiRequest } from "./client";
import type { SignInResponse, Post, NewsItem } from "./types";

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

/* Posts (Published / Scheduled screen) */
export function listPosts(params?: { page?: number; limit?: number; status?: string }) {
  return apiRequest<{ posts?: Post[]; data?: Post[]; items?: Post[] }>("/posts", { query: params });
}

/* News items (Approvals first tier) */
export function listNewsItems(params?: { status?: string }) {
  return apiRequest<{ news_items?: NewsItem[]; data?: NewsItem[]; items?: NewsItem[] }>("/news-items", { query: params });
}

export function moderateNewsItem(id: string, status: "approved" | "rejected", reason?: string) {
  return apiRequest<NewsItem>(`/news-items/${id}/moderation`, {
    method: "PATCH",
    body: { moderation_status: status, moderation_reason: reason },
  });
}

/* Dashboard stats */
export function dashboardStats() {
  return apiRequest<Record<string, unknown>>("/dashboard/stats");
}
