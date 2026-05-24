const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

/**
 * Resolves an image path to a full URL.
 * - If the path is already absolute (http/https), return as-is (e.g. Cloudinary).
 * - If the path is relative (starts with /), prepend the API base URL.
 * - Returns null for empty/falsy values.
 */
export default function resolveImageUrl(path) {
  if (!path || !String(path).trim()) return null;

  const trimmed = String(path).trim();

  // Already a full URL (Cloudinary, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Relative path from backend — prepend API base
  // Strip trailing /api/v1 or similar from the base URL to get the server origin
  const origin = API_BASE_URL.replace(/\/api\/v\d+\/?$/, "");
  return `${origin}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}
