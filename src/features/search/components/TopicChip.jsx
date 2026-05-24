function TopicChip({ topic, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition duration-300 sm:px-4 sm:py-2 ${
        isActive
          ? "border-sky-400/70 bg-sky-500/15 text-sky-200"
          : "border-slate-700/70 bg-slate-800/75 text-slate-200 hover:border-slate-500/70 hover:bg-slate-800"
      }`}
    >
      #{topic}
    </button>
  );
}

export default TopicChip;
