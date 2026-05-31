const TABS = [
  { key: "all", label: "All" },
  { key: "posts", label: "Posts" },
  { key: "communities", label: "Communities" },
  { key: "users", label: "Users" },
];

function formatCount(value) {
  if (value == null) return null;
  const safe = Number(value) || 0;
  if (safe >= 1000) return `${(safe / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return safe.toString();
}

export default function SearchTabs({ activeTab, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = tab.key === "all" ? null : counts[tab.key];
        const countLabel = formatCount(count);

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
              isActive
                ? "border-blue-500/60 bg-blue-500/15 text-blue-300"
                : "border-slate-700/70 bg-slate-900/60 text-slate-400 hover:border-slate-500/60 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {countLabel != null ? (
              <span
                className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                  isActive ? "bg-blue-500/30 text-blue-200" : "bg-slate-800 text-slate-500"
                }`}
              >
                {countLabel}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
