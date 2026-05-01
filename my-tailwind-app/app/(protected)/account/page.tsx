import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  const user = session.user;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Your profile and session information.
        </p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Avatar + identity */}
        <div className="px-6 py-6 flex items-center gap-5 border-b border-slate-700">
          {user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-16 h-16 rounded-full ring-2 ring-indigo-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-white">
              {user?.name || user?.login || "Unknown user"}
            </p>
            {user?.email && (
              <p className="text-slate-400 text-sm">{user.email}</p>
            )}
            {user?.login && (
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs mt-1 transition-colors"
              >
                @{user.login}
              </a>
            )}
          </div>
        </div>

        {/* Role */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-indigo-400">🔒</span>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Role
              </p>
              <p className="text-white text-sm font-medium capitalize">
                {user?.role || "viewer"}
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="px-6 py-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Session
          </p>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
