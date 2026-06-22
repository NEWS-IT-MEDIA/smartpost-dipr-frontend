import { API_V1, STORAGE } from "./config";

/** Thrown on any non-2xx response; carries status + parsed body for the UI. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export const tokenStore = {
  get access() {
    return localStorage.getItem(STORAGE.accessToken);
  },
  get refresh() {
    return localStorage.getItem(STORAGE.refreshToken);
  },
  get tenantId() {
    return localStorage.getItem(STORAGE.tenantId);
  },
  set(access: string, refresh: string, tenantId?: string | null) {
    localStorage.setItem(STORAGE.accessToken, access);
    localStorage.setItem(STORAGE.refreshToken, refresh);
    if (tenantId) localStorage.setItem(STORAGE.tenantId, tenantId);
  },
  setAccess(access: string) {
    localStorage.setItem(STORAGE.accessToken, access);
  },
  clear() {
    localStorage.removeItem(STORAGE.accessToken);
    localStorage.removeItem(STORAGE.refreshToken);
    localStorage.removeItem(STORAGE.tenantId);
    localStorage.removeItem(STORAGE.user);
  },
};

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Skip auth headers (login/refresh). */
  anon?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: Options["query"]): string {
  const url = new URL(`${API_V1}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

let refreshing: Promise<boolean> | null = null;

/** Attempt one token refresh; dedup concurrent 401s into a single call. */
async function tryRefresh(): Promise<boolean> {
  if (!tokenStore.refresh) return false;
  if (!refreshing) {
    refreshing = fetch(`${API_V1}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokenStore.refresh }),
    })
      .then(async (r) => {
        if (!r.ok) return false;
        const data = (await parse(r)) as { accessToken?: string } | null;
        if (data?.accessToken) {
          tokenStore.setAccess(data.accessToken);
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

/** Core request. Adds auth + tenant headers, retries once on 401 after refresh. */
export async function apiRequest<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = "GET", body, anon = false, query } = opts;

  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!anon) {
      if (tokenStore.access) headers["Authorization"] = `Bearer ${tokenStore.access}`;
      if (tokenStore.tenantId) headers["X-Tenant-ID"] = tokenStore.tenantId;
    }
    return fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !anon && (await tryRefresh())) {
    res = await doFetch();
  }

  const data = await parse(res);
  if (!res.ok) {
    const message =
      (data as { detail?: string; message?: string } | null)?.detail ??
      (data as { message?: string } | null)?.message ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, data);
  }
  return data as T;
}
