import { getSession } from "@/lib/session";
import { backendFetch } from "@/lib/api";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

interface StatsData {
  total_profiles?: number;
  total_queries?: number;
  unique_countries?: number;
  top_nationality?: string;
  [key: string]: unknown;
}

async function fetchStats(token: string): Promise<StatsData | null> {
  try {
    const res = await backendFetch("/api/stats", token);
    if (res.ok) return res.json();
  } catch {
    // stats endpoint may not exist
  }
  return null;
}

async function fetchProfileCount(token: string): Promise<number> {
  try {
    const res = await backendFetch("/api/profiles?page=1&limit=1", token);
    if (res.ok) {
      const data = await res.json();
      return data.total ?? data.count ?? data.data?.length ?? 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

export default async function DashboardPage() {
  const session = await getSession();
  const token = session.token!;

  const [stats, profileCount] = await Promise.all([
    fetchStats(token),
    fetchProfileCount(token),
  ]);

  const totalProfiles = stats?.total_profiles ?? profileCount;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back
          {session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-slate-400">
          Here&apos;s what&apos;s happening with your data.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard title="Total Profiles" value={totalProfiles} color="indigo" />
        <StatCard
          title="Total Queries"
          value={stats?.total_queries ?? "—"}
          color="violet"
        />
        <StatCard
          title="Unique Countries"
          value={stats?.unique_countries ?? "—"}
          color="sky"
        />
        <StatCard
          title="Top Nationality"
          value={stats?.top_nationality ?? "—"}
          color="emerald"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/profiles"
          className="group block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-colors"
        >
          <p className="text-2xl mb-2">👥</p>
          <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
            Browse Profiles
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            View and filter all name profiles in the database.
          </p>
        </a>
        <a
          href="/search"
          className="group block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500 transition-colors"
        >
          <p className="text-2xl mb-2">🔍</p>
          <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
            Search Names
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Look up classification results for any name.
          </p>
        </a>
        <a
          href="/account"
          className="group block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 transition-colors"
        >
          <p className="text-2xl mb-2">⚙️</p>
          <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors">
            My Account
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Manage your profile and API access.
          </p>
        </a>
      </div>
    </div>
  );
}
