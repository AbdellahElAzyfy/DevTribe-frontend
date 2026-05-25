/**
 * Group a flat list of comments into a nested tree by `parentComment`.
 *
 * The list endpoint returns a flat array (top-level + replies, mixed by
 * createdAt desc). We rebuild the hierarchy on the client so the UI can
 * render threaded replies.
 *
 * - Each comment gains a `replies` array (sorted oldest-first within a thread).
 * - Top-level comments keep the server order (newest-first).
 * - Replies whose parent is missing from the page bubble up to the top level
 *   so they remain visible instead of being silently dropped.
 *
 * @param {Array} comments - Flat list of comments from the API.
 * @returns {Array} Top-level comments, each with a nested `replies` array.
 */
export default function buildCommentTree(comments = []) {
  if (!Array.isArray(comments) || comments.length === 0) return [];

  const byId = new Map();
  comments.forEach((comment) => {
    byId.set(String(comment.id), { ...comment, replies: [] });
  });

  const topLevel = [];

  comments.forEach((comment) => {
    const node = byId.get(String(comment.id));
    const parentId = comment.parentComment
      ? String(comment.parentComment)
      : null;

    if (parentId && byId.has(parentId)) {
      byId.get(parentId).replies.push(node);
    } else {
      topLevel.push(node);
    }
  });

  // Replies oldest-first (conversational order); top-level stays newest-first.
  byId.forEach((node) => {
    if (node.replies.length > 1) {
      node.replies.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    }
  });

  return topLevel;
}
