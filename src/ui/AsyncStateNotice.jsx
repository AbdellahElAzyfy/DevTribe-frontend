function AsyncStateNotice({
  message,
  tone = "neutral",
  maxWidth = "",
  centered = false,
  className = "",
}) {
  const toneClassName =
    tone === "error"
      ? "border-red-500/30 text-red-300"
      : "border-slate-700/70 text-slate-400";

  const maxWidthClassName = maxWidth ? `mx-auto w-full ${maxWidth}` : "";

  return (
    <div
      className={`${maxWidthClassName} rounded-xl border bg-slate-900/60 p-5 text-sm ${toneClassName} ${
        centered ? "text-center" : ""
      } ${className}`.trim()}
    >
      {message}
    </div>
  );
}

export default AsyncStateNotice;
