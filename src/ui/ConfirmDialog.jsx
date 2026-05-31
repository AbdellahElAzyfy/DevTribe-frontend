import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

/**
 * Reusable styled confirmation dialog.
 *
 * Matches the app's dark modal styling (see CreateCommunityModal / EditProfileModal).
 * Used for destructive actions like deleting posts and comments.
 */
export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}) {
  // Close on Escape (ignored while the action is in flight)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const confirmClassName =
    tone === "danger"
      ? "border-rose-500/50 bg-rose-500/90 text-white hover:bg-rose-500"
      : "border-blue-500/50 bg-blue-600 text-white hover:bg-blue-500";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-[0_0_50px_-12px_rgba(244,63,94,0.25)]">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/30 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => {
              if (!isLoading) onClose();
            }}
            disabled={isLoading}
            className="rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-800 hover:text-slate-200 active:scale-90 disabled:opacity-50"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {description ? (
            <p className="text-sm leading-relaxed text-slate-300">
              {description}
            </p>
          ) : null}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex flex-1 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
            >
              {isLoading ? "Working..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
