import { getSession } from "@/lib/session";
import { backendFetch, type Profile } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchProfile(
  token: string,
  id: string,
): Promise<Profile | null> {
  const res = await backendFetch(`/api/profiles/${id}`, token);
  if (!res.ok) return null;
  const data = await res.json();
  return data.profile ?? data.data ?? data;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between py-3 border-b border-slate-700 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{String(value)}</span>
    </div>
  );
}

export default async function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = await getSession();
  const profile = await fetchProfile(session.token!, id);

  if (!profile) notFound();

  const displayName =
    profile.name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    `Profile #${id}`;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/profiles"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        ← Back to profiles
      </Link>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {profile.email && (
                <p className="text-indigo-200 text-sm mt-1">{profile.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Classification
          </h2>
          <div className="space-y-0">
            <DetailRow label="Gender" value={profile.gender} />
            <DetailRow label="Nationality" value={profile.nationality} />
            <DetailRow label="Country" value={profile.country} />
            <DetailRow label="Classification" value={profile.classification} />
            {profile.confidence !== undefined && (
              <DetailRow
                label="Confidence"
                value={`${(Number(profile.confidence) * 100).toFixed(1)}%`}
              />
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Details
          </h2>
          <div className="space-y-0">
            <DetailRow label="ID" value={profile.id} />
            <DetailRow label="First Name" value={profile.first_name} />
            <DetailRow label="Last Name" value={profile.last_name} />
            <DetailRow label="Email" value={profile.email} />
            <DetailRow label="Created" value={profile.created_at} />
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/40 flex gap-6">
          {profile.gender && (
            <span className="text-slate-400 text-sm">👥 {profile.gender}</span>
          )}
          {profile.country && (
            <span className="text-slate-400 text-sm">🌍 {profile.country}</span>
          )}
          {profile.confidence !== undefined && (
            <span className="text-slate-400 text-sm">
              📊 {(Number(profile.confidence) * 100).toFixed(0)}% confidence
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
