import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Resolves the public base URL used for shared links.
 *
 * Prefers VITE_PUBLIC_APP_URL so shared links point at a publicly reachable
 * address (a tunnel during local testing, or the deployed domain in prod)
 * instead of `http://localhost:5173`, which only resolves on the dev machine
 * and shows up as plain, unclickable text in apps like WhatsApp.
 *
 * Falls back to the current window origin when the env var is not set.
 */
function getPublicBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL;
  if (configured && String(configured).trim()) {
    // Drop any trailing slash so we don't produce "...//post/123".
    return String(configured).trim().replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

/**
 * Builds the canonical, absolute URL for a post so the shared link works
 * regardless of where the share happens (relative paths break outside the SPA).
 */
function buildPostUrl(postId) {
  const base = getPublicBaseUrl();
  return `${base}/post/${postId}`;
}

async function copyToClipboard(text) {
  // Preferred path: async Clipboard API (secure contexts / modern browsers)
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Legacy fallback for older/insecure contexts (e.g. plain http)
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Share behavior for a post:
 *   1. Native share sheet via the Web Share API (mobile / modern browsers).
 *   2. Fallback to copy-to-clipboard with transient "copied" feedback (desktop).
 *
 * Returns { share, didCopy } where `didCopy` flips to true for ~2s after a
 * successful clipboard copy so the UI can confirm the action.
 */
export function useSharePost({ postId, title }) {
  const [didCopy, setDidCopy] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const flagCopied = useCallback(() => {
    setDidCopy(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setDidCopy(false), 2000);
  }, []);

  const share = useCallback(async () => {
    if (!postId) return;

    const url = buildPostUrl(postId);

    // Prefer the OS share sheet when the browser supports it.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || "DevTribe post",
          text: title
            ? `Check out "${title}" on DevTribe`
            : "Check out this post on DevTribe",
          url,
        });
        return;
      } catch (error) {
        // The user dismissed the share sheet — nothing to report.
        if (error?.name === "AbortError") return;
        // Any other failure: fall through to the clipboard path.
      }
    }

    // Desktop fallback: copy the link and confirm inline.
    try {
      await copyToClipboard(url);
      flagCopied();
    } catch {
      // Swallow copy failures; nothing actionable for the user.
    }
  }, [postId, title, flagCopied]);

  return { share, didCopy };
}

export default useSharePost;
