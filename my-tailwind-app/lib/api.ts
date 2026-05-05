const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://db-query-backend-myitjournal8137-tp61obq3.leapcell.dev";

export { BACKEND };

export async function backendFetch(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${BACKEND}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-Version": "1",
      ...(options.headers as Record<string, string>),
    },
    cache: "no-store",
  });
  return res;
}

export interface Profile {
  id: string | number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  gender?: string;
  nationality?: string;
  country?: string;
  classification?: string;
  confidence?: number;
  created_at?: string;
  [key: string]: unknown;
}

export interface PaginatedProfiles {
  data: Profile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
