import { getSession } from "@/lib/session";
import { backendFetch, type Profile } from "@/lib/api";
import ProfileCard from "@/components/ProfileCard";
import Pagination from "@/components/Pagination";
import ProfileFilters from "@/components/ProfileFilters";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  limit?: string;
  gender?: string;
  nationality?: string;
  country?: string;
  search?: string;
  [key: string]: string | undefined;
}

async function fetchProfiles(token: string, params: SearchParams) {
  const qs = new URLSearchParams();
  qs.set("page", params.page || "1");
  qs.set("limit", params.limit || "12");
  if (params.gender) qs.set("gender", params.gender);
  if (params.nationality) qs.set("nationality", params.nationality);
  if (params.country) qs.set("country", params.country);
  if (params.search) qs.set("search", params.search);

  const res = await backendFetch(`/api/profiles?${qs.toString()}`, token);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  const params = searchParams;
  const result = await fetchProfiles(session.token!, params);

  const profiles: Profile[] = result?.data ?? result?.profiles ?? [];
  const total: number = result?.total ?? result?.count ?? profiles.length;
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
  const totalPages = result?.totalPages ?? Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profiles</h1>
          <p className="mt-1 text-slate-400 text-sm">
            {total.toLocaleString()} total records
          </p>
        </div>
      </div>

      <ProfileFilters currentParams={params} />

      {profiles.length === 0 ? (
        <div className="mt-12 text-center text-slate-500">
          No profiles found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} params={params} />
          </div>
        </>
      )}
    </div>
  );
}
