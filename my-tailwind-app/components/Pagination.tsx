import Link from "next/link";
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

interface PaginationProps {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}

function buildHref(params: Record<string, string | undefined>, page: number) {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (key !== "page" && val) qs.set(key, val);
  }
  qs.set("page", String(page));
  return `?${qs.toString()}`;
}

export default function Pagination({
  page,
  totalPages,
  params,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <PageLink
        href={buildHref(params, page - 1)}
        disabled={page <= 1}
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </PageLink>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={buildHref(params, p as number)}
            active={p === page}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={buildHref(params, page + 1)}
        disabled={page >= totalPages}
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </PageLink>
    </div>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const base =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors";
  const cls = disabled
    ? `${base} text-slate-600 cursor-not-allowed pointer-events-none`
    : active
      ? `${base} bg-indigo-600 text-white`
      : `${base} text-slate-400 hover:text-white hover:bg-slate-800`;

  if (disabled) return <span className={cls}>{children}</span>;

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
