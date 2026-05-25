import { queryKeys } from "../../lib/queryKeys";
import { addPending } from "../pendingNewPostsStore";

const idOf = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return String(value.id ?? value._id ?? value);
};

const sameId = (a, b) => idOf(a) && idOf(b) && idOf(a) === idOf(b);

function patchPostInLists(queryClient, predicate, updater) {
  queryClient.setQueriesData({ queryKey: queryKeys.posts.all() }, (oldData) => {
    if (!oldData) return oldData;

    if (Array.isArray(oldData)) {
      let changed = false;
      const next = oldData.map((post) => {
        if (predicate(post)) {
          changed = true;
          return updater(post);
        }
        return post;
      });
      return changed ? next : oldData;
    }

    if (Array.isArray(oldData?.posts)) {
      let changed = false;
      const nextPosts = oldData.posts.map((post) => {
        if (predicate(post)) {
          changed = true;
          return updater(post);
        }
        return post;
      });
      return changed ? { ...oldData, posts: nextPosts } : oldData;
    }

    if (predicate(oldData)) {
      return updater(oldData);
    }
    return oldData;
  });
}

export function register(socket, { queryClient, currentUserId }) {
  const isSelf = (actorId) => actorId && String(actorId) === String(currentUserId);

  const onCreated = ({ post, actorId }) => {
    if (isSelf(actorId)) return;
    const postId = idOf(post);
    if (!postId) return;

    const communitySlug = post?.community?.slug;

    // Feed (any params)
    queryClient.getQueryCache()
      .findAll({ queryKey: queryKeys.posts.feed() })
      .forEach((q) => addPending(q.queryKey, postId));

    // Popular and other "all posts" lists
    queryClient.getQueryCache()
      .findAll({ queryKey: queryKeys.posts.lists() })
      .forEach((q) => {
        const params = q.queryKey[q.queryKey.length - 1];
        if (params && typeof params === "object" && params.community && communitySlug && params.community !== communitySlug) {
          return;
        }
        addPending(q.queryKey, postId);
      });
  };

  const onUpdated = ({ post }) => {
    const postId = idOf(post);
    if (!postId) return;
    queryClient.setQueryData(queryKeys.posts.detail(postId), post);
    patchPostInLists(queryClient, (p) => sameId(p, postId), () => post);
  };

  const onDeleted = ({ postId }) => {
    if (!postId) return;
    queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
    queryClient.setQueriesData({ queryKey: queryKeys.posts.all() }, (oldData) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return oldData.filter((p) => !sameId(p, postId));
      }
      if (Array.isArray(oldData?.posts)) {
        return { ...oldData, posts: oldData.posts.filter((p) => !sameId(p, postId)) };
      }
      return oldData;
    });
  };

  const onVoted = ({ vote, actorId }) => {
    if (isSelf(actorId)) return;
    const postId = vote?.postId ?? vote?.targetId;
    if (!postId) return;

    // Prefer the server's authoritative voteCount; fall back to a delta nudge
    // for legacy payloads that don't carry it. The value-as-delta fallback is
    // wrong for toggle-off (value=0) and side-switch (value=±1, delta=±2),
    // but kept so older servers degrade gracefully.
    const hasVoteCount = vote?.voteCount != null;
    const nextVoteCount = hasVoteCount ? Number(vote.voteCount) : null;
    const delta = Number(vote?.delta ?? vote?.value ?? 0);

    const applyPatch = (p) => {
      const current = Number(p.voteCount ?? 0);
      const next = hasVoteCount
        ? nextVoteCount
        : Number.isFinite(delta) && delta !== 0
          ? current + delta
          : current;
      return { ...p, voteCount: next };
    };

    queryClient.setQueryData(queryKeys.posts.detail(postId), (prev) => {
      if (!prev) return prev;
      return applyPatch(prev);
    });

    patchPostInLists(queryClient, (p) => sameId(p, postId), applyPatch);
  };

  socket.on("post:created", onCreated);
  socket.on("post:updated", onUpdated);
  socket.on("post:deleted", onDeleted);
  socket.on("post:voted", onVoted);

  return () => {
    socket.off("post:created", onCreated);
    socket.off("post:updated", onUpdated);
    socket.off("post:deleted", onDeleted);
    socket.off("post:voted", onVoted);
  };
}
