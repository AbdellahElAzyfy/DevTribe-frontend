import { queryKeys } from "../../lib/queryKeys";

const idOf = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return String(value.id ?? value._id ?? value);
};

function bumpPostCommentCount(queryClient, postId, delta) {
  if (!postId) return;
  queryClient.setQueryData(queryKeys.posts.detail(postId), (prev) => {
    if (!prev) return prev;
    const current = Number(prev.commentCount ?? 0);
    return { ...prev, commentCount: Math.max(0, current + delta) };
  });
}

function findCommentLists(queryClient, postId) {
  return queryClient
    .getQueryCache()
    .findAll({ queryKey: ["comments", "list", "byPost", String(postId)] });
}

export function register(socket, { queryClient, currentUserId }) {
  const isSelf = (actorId) => actorId && String(actorId) === String(currentUserId);

  const onCreated = ({ comment, actorId }) => {
    const postId = idOf(comment?.post ?? comment?.postId);
    if (!postId) return;

    if (!isSelf(actorId)) {
      findCommentLists(queryClient, postId).forEach((q) => {
        queryClient.setQueryData(q.queryKey, (prev) => {
          if (!prev) return prev;

          if (Array.isArray(prev)) {
            if (prev.some((c) => idOf(c) === idOf(comment))) return prev;
            return [...prev, comment];
          }

          if (Array.isArray(prev?.comments)) {
            if (prev.comments.some((c) => idOf(c) === idOf(comment))) return prev;
            return { ...prev, comments: [...prev.comments, comment] };
          }

          return prev;
        });
      });
    }

    bumpPostCommentCount(queryClient, postId, 1);
  };

  const onUpdated = ({ comment }) => {
    const postId = idOf(comment?.post ?? comment?.postId);
    if (!postId) return;

    queryClient.setQueryData(queryKeys.comments.detail(idOf(comment)), comment);

    findCommentLists(queryClient, postId).forEach((q) => {
      queryClient.setQueryData(q.queryKey, (prev) => {
        if (!prev) return prev;

        const map = (arr) => arr.map((c) => (idOf(c) === idOf(comment) ? { ...c, ...comment } : c));

        if (Array.isArray(prev)) return map(prev);
        if (Array.isArray(prev?.comments)) return { ...prev, comments: map(prev.comments) };
        return prev;
      });
    });
  };

  const onDeleted = ({ commentId, postId }) => {
    if (!postId) return;

    findCommentLists(queryClient, postId).forEach((q) => {
      queryClient.setQueryData(q.queryKey, (prev) => {
        if (!prev) return prev;
        const filter = (arr) => arr.filter((c) => idOf(c) !== String(commentId));
        if (Array.isArray(prev)) return filter(prev);
        if (Array.isArray(prev?.comments)) return { ...prev, comments: filter(prev.comments) };
        return prev;
      });
    });

    queryClient.removeQueries({ queryKey: queryKeys.comments.detail(commentId) });
    bumpPostCommentCount(queryClient, postId, -1);
  };

  const onVoted = ({ vote, actorId }) => {
    if (isSelf(actorId)) return;
    const commentId = vote?.targetId;
    const postId = vote?.postId;
    const delta = Number(vote?.delta ?? vote?.value ?? 0);
    if (!commentId || !postId) return;

    findCommentLists(queryClient, postId).forEach((q) => {
      queryClient.setQueryData(q.queryKey, (prev) => {
        if (!prev) return prev;
        const patch = (arr) =>
          arr.map((c) => {
            if (idOf(c) !== String(commentId)) return c;
            const current = Number(c.voteCount ?? 0);
            const next = Number.isFinite(delta) && delta !== 0 ? current + delta : current;
            return { ...c, voteCount: next };
          });
        if (Array.isArray(prev)) return patch(prev);
        if (Array.isArray(prev?.comments)) return { ...prev, comments: patch(prev.comments) };
        return prev;
      });
    });
  };

  socket.on("comment:created", onCreated);
  socket.on("comment:updated", onUpdated);
  socket.on("comment:deleted", onDeleted);
  socket.on("comment:voted", onVoted);

  return () => {
    socket.off("comment:created", onCreated);
    socket.off("comment:updated", onUpdated);
    socket.off("comment:deleted", onDeleted);
    socket.off("comment:voted", onVoted);
  };
}
