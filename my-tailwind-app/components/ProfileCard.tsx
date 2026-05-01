import Link from "next/link";
import { type Profile } from "@/lib/api";
const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
    />
  </svg>
);
const Users = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const User = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default function ProfileCard({ profile }: { profile: Profile }) {
  const name =
    profile.name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    `#${profile.id}`;

  const initial = name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/profiles/${profile.id}`}
      className="group block p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-900/20"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-semibold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm truncate group-hover:text-indigo-300 transition-colors">
            {name}
          </p>
          {profile.email && (
            <p className="text-slate-500 text-xs truncate">{profile.email}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {profile.gender && (
          <Badge icon={<Users className="w-3 h-3" />} label={profile.gender} />
        )}
        {(profile.nationality || profile.country) && (
          <Badge
            icon={<Globe className="w-3 h-3" />}
            label={(profile.nationality || profile.country) as string}
          />
        )}
        {profile.classification && (
          <Badge
            icon={<User className="w-3 h-3" />}
            label={profile.classification as string}
          />
        )}
      </div>

      {profile.confidence !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Confidence</span>
            <span>{(Number(profile.confidence) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{
                width: `${(Number(profile.confidence) * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs">
      {icon}
      {label}
    </span>
  );
}
