const colors: Record<string, string> = {
  indigo: "bg-indigo-900/30 border-indigo-800 text-indigo-300",
  violet: "bg-violet-900/30 border-violet-800 text-violet-300",
  sky: "bg-sky-900/30 border-sky-800 text-sky-300",
  emerald: "bg-emerald-900/30 border-emerald-800 text-emerald-300",
};

export default function StatCard({
  title,
  value,
  color = "indigo",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${colors[color] ?? colors.indigo}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
