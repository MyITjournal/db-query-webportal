import { getSession } from "@/lib/session";
import { backendFetch, type Profile } from "@/lib/api";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  page?: string;
}

async function searchProfiles(
  token: string,
  q: string,
  page: number,
): Promise<{ profiles: Profile[]; total: number; totalPages: number } | null> {
  // Try dedicated search endpoint first, fall back to profiles with search param
  const qs = new URLSearchParams({
    search: q,
    page: String(page),
    limit: "12",
  });

  let res = await backendFetch(`/api/search?${qs.toString()}`, token);
  if (!res.ok) {
    res = await backendFetch(`/api/profiles?${qs.toString()}`, token);
  }
  if (!res.ok) return null;

  const data = await res.json();
  return {
    profiles: data.data ?? data.profiles ?? data.results ?? [],
    total: data.total ?? data.count ?? 0,
    totalPages: data.totalPages ?? Math.ceil((data.total ?? 0) / 12),
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  const params = searchParams;
  const q = params.q?.trim() || "";
  const page = Number(params.page || 1);

  const result = q ? await searchProfiles(session.token!, q, page) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Find classification results for any name.
        </p>
      </div>

      <SearchBar defaultValue={q} placeholder="Search by name, nationality…" />

      {q && !result && (
        <div className="mt-12 text-center text-slate-500">
          Something went wrong. Please try again.
        </div>
      )}

      {q && result && result.profiles.length === 0 && (
        <div className="mt-12 text-center text-slate-500">
          No results for &ldquo;{q}&rdquo;.
        </div>
      )}

      {result && result.profiles.length > 0 && (
        <>
          <p className="mt-4 text-sm text-slate-400">
            {result.total.toLocaleString()} result
            {result.total !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={result.totalPages}
              params={{ q, page: String(page) }}
            />
          </div>
        </>
      )}

      {!q && (
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Enter a name above to see classification results.
          </p>
        </div>
      )}
    </div>
  );
}
