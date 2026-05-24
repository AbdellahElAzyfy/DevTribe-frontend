/**
 * Formats a date string or object into a "time ago" string.
 * @param {string|Date} date - The date to format
 * @returns {string} - e.g., "5h ago", "2d ago", "just now"
 */
export function formatTimeAgo(date) {
  if (!date) return "";
  
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  
  // Handle future dates or invalid dates
  if (diffInMs < 0 || isNaN(diffInMs)) return "just now";

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Estimates reading time based on text length.
 * @param {string} text - The content to analyze
 * @returns {string} - e.g., "4 min read"
 */
export function calculateReadTime(text) {
  if (!text) return "1 min read";
  
  const wordsPerMinute = 225; // Average reading speed
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}

/**
 * Formats a community name with the "r/" prefix.
 * @param {string} name - The community name or slug
 * @returns {string} - e.g., "r/DesignSystems"
 */
export function formatCommunityName(name) {
  if (!name) return "";
  if (name.startsWith("r/")) return name;
  return `r/${name.replace(/\s+/g, "")}`;
}

/**
 * Formats a username with the "@" prefix.
 * @param {string} username - The username
 * @returns {string} - e.g., "@johndoe"
 */
export function formatUsername(username) {
  if (!username) return "";
  if (username.startsWith("@")) return username;
  return `@${username}`;
}
