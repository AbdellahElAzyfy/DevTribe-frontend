# DevTribe Frontend Architecture Guide

## Folder Structure

```
src/
├── hooks/
│   ├── useAuthQueries.js          # Auth hooks (login, register, refresh)
│   ├── useCommunityQueries.js     # Community queries & mutations
│   ├── usePostQueries.js          # Post queries & mutations (includes voting)
│   ├── useCommentQueries.js       # Comment queries & mutations (includes voting)
│   ├── useAuth.js                 # OLD - can remove after migration
│   └── useDebouncedValue.js       # Existing utility hook
│
├── services/
│   ├── apiClient.js               # Axios instance with auth interceptors
│   ├── apiAuth.js                 # Auth API functions
│   ├── apiCommunities.js          # Communities API functions
│   ├── apiPosts.js                # Posts API functions
│   ├── apiComments.js             # Comments API functions
│   ├── apiVotes.js                # Vote API functions
│   └── mockSocialApi.js           # Existing mock API (can remove)
│
├── lib/
│   ├── queryClient.js             # React Query client config
│   ├── queryKeys.js               # Centralized query key factory
│   └── queryClient.config.js      # Optional: Advanced React Query config
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProfileEditor.jsx
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   │
│   ├── communities/
│   │   ├── components/
│   │   │   ├── CommunityCard.jsx
│   │   │   ├── CommunityList.jsx
│   │   │   ├── JoinButton.jsx
│   │   │   └── CommunityHeader.jsx
│   │   └── pages/
│   │       ├── CommunitiesPage.jsx
│   │       └── CommunityDetailPage.jsx
│   │
│   ├── posts/
│   │   ├── components/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── PostList.jsx
│   │   │   └── VoteButtons.jsx
│   │   └── pages/
│   │       ├── FeedPage.jsx
│   │       ├── PostDetailPage.jsx
│   │       └── CreatePostPage.jsx
│   │
│   ├── comments/
│   │   ├── components/
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   ├── CommentItem.jsx
│   │   │   └── CommentVoteButtons.jsx
│   │   └── hooks/ (local hooks if needed)
│   │
│   └── search/
│       ├── components/
│       └── pages/
│
├── ui/
│   ├── AppLayout.jsx
│   ├── Button.jsx
│   ├── Header.jsx
│   ├── LeftSidebar.jsx
│   ├── RightSidebar.jsx
│   └── ...
│
├── utils/
│   ├── errorHandler.js       # Error handling utilities
│   ├── formatters.js         # Date, number formatting
│   └── validators.js         # Input validation
│
├── store/
│   ├── index.js             # Redux setup
│   └── uiSlice.js           # UI state
│
├── context/
│   ├── AuthContext.jsx      # Authentication context
│   └── authContextValue.js
│
├── App.jsx
├── main.jsx
└── index.css
```

## React Query Configuration

### 1. Query Client Setup (`lib/queryClient.js`)

```javascript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 2. Query Key Convention

**Structure:** `[feature, subFeature?, ...specifics]`

```javascript
queryKeys.posts.list({ page: 1, limit: 10 }); // ["posts", "list", {...}]
queryKeys.posts.detail("123"); // ["posts", "detail", "123"]
queryKeys.comments.listByPost("123", { page: 1 }); // ["comments", "list", "byPost", "123", {...}]
queryKeys.communities.detail("dev-tribe"); // ["communities", "detail", "dev-tribe"]
```

**Benefits:**

- Predictable cache structure
- Easy batch invalidation
- Type-safe (with autocomplete in TypeScript)

### 3. Cache Invalidation Strategy

**By feature:**

```javascript
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.lists(), // Invalidates ALL post lists
});
```

**By specific resource:**

```javascript
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.detail("123"),
});
```

**Partial pattern:**

```javascript
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.all(), // Invalidates all posts queries
});
```

### 4. Optimistic Updates

Optimistic updates make the UI feel instant, especially for votes.

```javascript
const mutation = useMutation({
  mutationFn: ({ postId, value }) => votePost(postId, { value }),

  onMutate: ({ postId, value }) => {
    // 1. Cancel ongoing queries to prevent race conditions
    queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

    // 2. Get previous data for rollback
    const previousPost = queryClient.getQueryData(
      queryKeys.posts.detail(postId),
    );

    // 3. Update cache optimistically
    if (previousPost) {
      queryClient.setQueryData(queryKeys.posts.detail(postId), {
        ...previousPost,
        votes: {
          ...previousPost.votes,
          userVote: value,
          upvotes:
            value === "up"
              ? previousPost.votes.upvotes + 1
              : previousPost.votes.upvotes,
        },
      });
    }

    return { previousPost }; // Return context for error handling
  },

  onError: (error, variables, context) => {
    // Rollback on error
    if (context?.previousPost) {
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        context.previousPost,
      );
    }
  },

  onSuccess: () => {
    // Refetch to ensure sync with server
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
  },
});
```

### 5. Stale Time Best Practices

```javascript
// Fast-changing data
useListComments(postId, { staleTime: 30 * 1000 }); // 30 seconds

// Moderate changes
useListPosts({ staleTime: 2 * 60 * 1000 }); // 2 minutes

// Stable data
useCommunity(slug, { staleTime: 5 * 60 * 1000 }); // 5 minutes

// User profile (rarely changes)
useCurrentUser({ staleTime: 10 * 60 * 1000 }); // 10 minutes
```

### 6. Error Handling

Create a utility for centralized error handling:

```javascript
// utils/errorHandler.js
export function getErrorMessage(error) {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function isValidationError(error) {
  return error?.response?.status === 400;
}

export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

export function isConflictError(error) {
  return error?.response?.status === 409;
}
```

Usage:

```javascript
const { mutate, isError, error } = useCreatePost();

{
  isError && <ErrorAlert message={getErrorMessage(error)} />;
}
```

### 7. Loading States

```javascript
export function PostList() {
  const { data, isLoading, error } = useListPosts({ page: 1 });

  if (isLoading) return <PostListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.posts?.length) return <EmptyState />;

  return (
    <div>
      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Component Integration Examples

### 1. Auth Integration

```javascript
// features/auth/pages/LoginPage.jsx
import { useLogin } from "../../../hooks/useAuthQueries";

export function LoginPage() {
  const {
    mutate: login,
    isPending,
    error,
  } = useLogin({
    onSuccess: (data) => {
      navigate("/"); // Redirect after successful login
    },
  });

  return (
    <LoginForm
      onSubmit={(credentials) => login(credentials)}
      isLoading={isPending}
      error={error}
    />
  );
}
```

### 2. Community Integration

```javascript
// features/communities/components/JoinButton.jsx
import {
  useJoinCommunity,
  useLeaveCommunity,
} from "../../../hooks/useCommunityQueries";

export function JoinButton({ slug, isMember }) {
  const { mutate: join, isPending: isJoining } = useJoinCommunity({
    onSuccess: () => {
      toast.success("Joined community!");
    },
  });

  const { mutate: leave, isPending: isLeaving } = useLeaveCommunity({
    onSuccess: () => {
      toast.success("Left community!");
    },
  });

  if (isMember) {
    return (
      <Button
        onClick={() => leave(slug)}
        disabled={isLeaving}
        variant="secondary"
      >
        {isLeaving ? "Leaving..." : "Leave"}
      </Button>
    );
  }

  return (
    <Button onClick={() => join(slug)} disabled={isJoining}>
      {isJoining ? "Joining..." : "Join"}
    </Button>
  );
}
```

### 3. Post Listing with Pagination

```javascript
// features/posts/pages/FeedPage.jsx
import { useFeed } from "../../../hooks/usePostQueries";
import { useState } from "react";

export function FeedPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useFeed(
    { page, limit, sortBy: "trending" },
    { keepPreviousData: true },
  );

  if (isLoading && !data) return <PostListSkeleton />;

  return (
    <div>
      <PostList posts={data?.posts || []} />

      <Pagination
        page={page}
        total={data?.pagination?.total || 0}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 4. Post Detail with Comments and Voting

```javascript
// features/posts/pages/PostDetailPage.jsx
import { usePost } from "../../../hooks/usePostQueries";
import { useListComments } from "../../../hooks/useCommentQueries";

export function PostDetailPage({ postId }) {
  const { data: postData, isLoading } = usePost(postId);
  const { data: commentsData } = useListComments(postId, { page: 1 });

  if (isLoading) return <PostSkeleton />;

  return (
    <div>
      <PostDetail post={postData?.post} />
      <VoteButtons postId={postId} votes={postData?.post?.votes} />
      <CommentSection postId={postId} comments={commentsData?.comments || []} />
    </div>
  );
}
```

### 5. Vote Button with Optimistic Updates

```javascript
// features/posts/components/VoteButtons.jsx
import { useVotePost } from "../../../hooks/usePostQueries";

export function VoteButtons({ postId, votes }) {
  const { mutate: vote } = useVotePost();

  const handleUpvote = () => {
    const newValue = votes?.userVote === "up" ? null : "up";
    vote({ postId, value: newValue });
  };

  const handleDownvote = () => {
    const newValue = votes?.userVote === "down" ? null : "down";
    vote({ postId, value: newValue });
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleUpvote}
        className={votes?.userVote === "up" ? "text-green-600" : ""}
      >
        ⬆ {votes?.upvotes || 0}
      </button>

      <button
        onClick={handleDownvote}
        className={votes?.userVote === "down" ? "text-red-600" : ""}
      >
        ⬇ {votes?.downvotes || 0}
      </button>
    </div>
  );
}
```

## DO's and DON'Ts

### DO ✅

- Use the query key factory for all cache operations
- Implement optimistic updates for fast interactions (votes, joins)
- Set appropriate `staleTime` based on data freshness requirements
- Use `keepPreviousData: true` for pagination to avoid UI flashing
- Batch invalidations when multiple queries are affected
- Handle errors with user-friendly messages
- Always provide loading/error states

### DON'T ❌

- Don't manually construct query keys; use `queryKeys` factory
- Don't forget to invalidate related queries after mutations
- Don't set `staleTime` too high for frequently changing data
- Don't disable retry logic unless necessary
- Don't miss optimistic rollback on error
- Don't mix API calls with UI state in components
- Don't leave mutations without error boundaries

## Migration Checklist

- [ ] Update all API calls to use new service functions
- [ ] Replace old query hooks with new ones from `usePostQueries`, `useCommentQueries`, etc.
- [ ] Update query keys everywhere to use `queryKeys` factory
- [ ] Test pagination and infinite scroll
- [ ] Test vote optimistic updates
- [ ] Test error scenarios
- [ ] Verify cache invalidation works correctly
- [ ] Remove `mockSocialApi.js` and old hooks
- [ ] Add error boundaries around mutation components
