# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTribe frontend is a React-based community platform built with Vite, React Router, Redux Toolkit, TanStack Query (React Query), and Tailwind CSS. It provides authentication, community browsing, post creation/viewing, commenting, real-time notifications, and user profiles.

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Environment Setup

Create a `.env` file with:
- `VITE_API_URL` - Backend API base URL (e.g., `http://localhost:5000/api/v1`)
- `VITE_SOCKET_URL` - Socket.io server URL (e.g., `http://localhost:5000`)
- `VITE_PUBLIC_APP_URL` - (Optional) Public base URL used to build shareable post links (see `useSharePost`). Falls back to `window.location.origin` when unset. Set to a tunnel URL for local share testing, or the deployed domain in production. A `localhost` value cannot be opened by other people/devices.

## Architecture

The frontend follows a feature-based architecture with shared UI components:

```
src/
├── features/          # Feature modules (auth, posts, communities, comments, etc.)
├── pages/            # Route components (thin wrappers around feature components)
├── ui/               # Shared UI components (Button, Header, Sidebar, etc.)
├── hooks/            # Custom React hooks
├── services/         # API client and service functions
├── context/          # React Context providers (AuthContext)
├── store/            # Redux store and slices
├── lib/              # Library configurations (queryClient, queryKeys)
├── realtime/         # Socket.io integration and handlers
├── utils/            # Utility functions
└── constants/        # Constants and configuration
```

### Key Architectural Patterns

**Feature-Based Organization**: Each feature (auth, posts, communities, comments, notifications, saves, search, users) has its own directory containing:
- Page components or feature components
- Feature-specific hooks (e.g., `usePostQueries.js`, `useCommunityQueries.js`)
- Feature-specific utilities and schemas

**Pages as Route Wrappers**: Components in `src/pages/` are thin wrappers that import and render feature components. They handle route-level concerns but delegate logic to feature components.

**Shared UI Components**: Reusable components in `src/ui/` are framework-agnostic and accept props for customization. They don't contain business logic or API calls.

## State Management Strategy

The app uses **multiple state management solutions** for different concerns:

### 1. TanStack Query (React Query) - Server State
Primary tool for **all server data** (posts, communities, comments, users, notifications):
- Automatic caching, refetching, and background updates
- Optimistic updates for mutations
- Query invalidation for data synchronization
- Configured in `src/lib/queryClient.js` with 1-minute stale time and 10-minute cache time

**Query Keys**: Centralized in `src/lib/queryKeys.js` for consistency. Use these constants when invalidating queries.

**Custom Hooks Pattern**: Each feature has a `use[Feature]Queries.js` hook that encapsulates all TanStack Query logic:
- `usePostQueries()` - Posts data and mutations
- `useCommunityQueries()` - Communities data and mutations
- `useCommentQueries()` - Comments data and mutations
- `useAuthQueries()` - Auth-related queries

These hooks return objects with `{ queries: {...}, mutations: {...} }` structure.

### 2. React Context - Authentication State
`AuthContext` (`src/context/AuthContext.jsx`) manages:
- Current user object
- Access token (in-memory)
- Authentication status
- Auth methods: `login()`, `register()`, `logout()`, `refresh()`, `fetchMe()`

Access via `useAuth()` hook. The context handles:
- Session bootstrapping on app load (attempts refresh)
- Token refresh on 401 errors (via `apiClient` interceptor)
- Socket.io connection/disconnection based on auth state
- Query cache clearing on logout

### 3. Redux Toolkit - UI State Only
Redux store (`src/store/`) manages **only UI state** (not server data):
- `uiSlice.js` - UI-related state (modals, sidebars, loading states, etc.)

Use Redux for ephemeral UI state that doesn't belong in server cache or URL.

### 4. URL State - Navigation
React Router manages route state. Use `useParams()`, `useSearchParams()`, and `useNavigate()` for route-based state.

## Authentication Flow

1. **Session Bootstrap**: On app load, `AuthContext` attempts to refresh the session using the httpOnly refresh token cookie. If successful, fetches current user. If failed, clears session.

2. **Login/Register**: Calls backend API, receives access token and user object. Stores token in memory (via `AuthContext`), connects Socket.io.

3. **Token Refresh**: When a request receives 401, `apiClient` interceptor automatically calls `/auth/refresh` to get a new access token. If refresh fails, triggers `handleUnauthorized()` which clears session and redirects to login.

4. **Logout**: Calls backend `/auth/logout`, clears local state, disconnects socket, clears React Query cache.

5. **Protected Routes**: `ProtectedRoute` component checks `authChecked` and `isAuthenticated` from `useAuth()`. Redirects to `/login` if not authenticated.

6. **Public Routes**: `PublicRoute` component redirects authenticated users to `/home`.

## API Client Configuration

`src/services/apiClient.js` is an Axios instance with:
- Base URL from `VITE_API_URL`
- `withCredentials: true` for httpOnly cookies
- Request interceptor: Adds `Authorization: Bearer <token>` header
- Response interceptor: Handles 401 errors with automatic token refresh and request retry

**Service Files**: Each domain has a service file (e.g., `apiAuth.js`, `apiPosts.js`, `apiCommunities.js`, `apiComments.js`) that exports functions wrapping API calls. These are consumed by custom hooks.

## Real-time Features (Socket.io)

Socket.io client is configured in `src/services/socketClient.js`:
- Connects when user authenticates (access token sent in auth handshake)
- Disconnects on logout
- Singleton pattern: `getSocket()` returns the active socket instance

**Event Handlers**: Organized in `src/realtime/handlers/`:
- `notifications.js` - Handles `notification` events, invalidates notification queries
- `posts.js` - Handles `newPost` events, shows banner for new posts
- `comments.js` - Handles `newComment` events, invalidates comment queries

**SocketProvider**: Component in `src/realtime/SocketProvider.jsx` registers all event handlers when authenticated. Wrap your app with this provider (already done in `main.jsx`).

**Real-time Updates Pattern**:
1. Backend emits Socket.io event (e.g., `io.to(userId).emit('notification', data)`)
2. Frontend handler receives event
3. Handler invalidates relevant React Query cache (e.g., `queryClient.invalidateQueries(['notifications'])`)
4. React Query automatically refetches data
5. UI updates reactively

## Form Handling

Forms use **TanStack Form** (`@tanstack/react-form`) with **Zod** validation:
- Define Zod schemas in feature directories (e.g., `src/features/auth/authSchemas.js`)
- Use `useForm()` hook from TanStack Form
- Attach validators with `zodValidator()` adapter
- Handle submission with mutation hooks from custom query hooks

Example pattern:
```javascript
const form = useForm({
  defaultValues: { email: '', password: '' },
  onSubmit: async ({ value }) => {
    await loginMutation.mutateAsync(value);
  },
  validators: {
    onChange: zodValidator(loginSchema),
  },
});
```

## Routing Structure

- `/login`, `/signup` - Public routes (redirect to `/home` if authenticated)
- `/` - Redirects to `/home`
- `/home` - User's personalized feed (posts from joined communities)
- `/communities` - Browse all communities
- `/community/:id` - Community detail page with posts
- `/post/:id` - Post detail page with comments
- `/create-post` - Create new post
- `/manage-communities` - Manage user's communities (moderator/admin)
- `/profile` - User profile
- `/notifications` - User notifications
- `/popular` - Popular posts across all communities
- `/explore` - Discover new communities and trending posts
- `/saved` - User's saved posts

All authenticated routes are wrapped in `AppLayout` which includes Header, LeftSidebar, and RightSidebar.

## Styling

**Tailwind CSS v4** with Vite plugin:
- Utility-first CSS framework
- Configuration in `tailwind.config.js` (if present) or inline in CSS
- Custom styles in `src/index.css`
- Component-specific styles use Tailwind classes

**Responsive Design**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for breakpoints.

## Code Syntax Highlighting

Posts and comments support code blocks with syntax highlighting:
- `highlight.js` library for syntax highlighting
- `react-syntax-highlighter` component for rendering
- `ContentRenderer` component (`src/ui/ContentRenderer.jsx`) handles rendering post/comment content with code blocks

## Image Handling

Images are uploaded to Cloudinary via the backend:
- Post images: Uploaded when creating/editing posts
- User avatars: Uploaded when updating profile
- `resolveImageUrl()` utility (`src/utils/resolveImageUrl.js`) handles image URL resolution

## Error Handling

Errors are handled at multiple levels:

1. **API Client Level**: `apiClient` interceptor catches 401 errors and attempts token refresh
2. **Service Level**: Service functions throw errors with meaningful messages
3. **Hook Level**: TanStack Query mutations expose `error` state
4. **Component Level**: Components display error messages from mutation/query errors
5. **Global Error Boundary**: (If implemented) Catches unhandled errors

Use `src/utils/errorHandler.js` for consistent error message extraction.

## Adding New Features

When adding a new feature:

1. **Create Feature Directory**: `src/features/[feature-name]/`
2. **Service Functions**: Add API calls in `src/services/api[Feature].js`
3. **Custom Hook**: Create `use[Feature]Queries.js` with TanStack Query hooks
4. **Components**: Build feature components in the feature directory
5. **Page Component**: Create route wrapper in `src/pages/`
6. **Route**: Add route to `App.jsx` router configuration
7. **Real-time (Optional)**: Add Socket.io handler in `src/realtime/handlers/` if needed

Follow existing patterns: look at `posts`, `communities`, or `comments` features as reference.

## Common Patterns

**Optimistic Updates**: When mutating data, update the cache optimistically before the server responds:
```javascript
const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['posts', postId]);
    const previous = queryClient.getQueryData(['posts', postId]);
    queryClient.setQueryData(['posts', postId], newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['posts', postId], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['posts', postId]);
  },
});
```

**Conditional Queries**: Use `enabled` option to conditionally fetch:
```javascript
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId, // Only fetch if userId exists
});
```

**Infinite Queries**: For paginated lists (if implemented), use `useInfiniteQuery`.

## Testing

Currently no test setup. When adding tests:
- Use Vitest (Vite's test runner) or Jest
- Test utilities: React Testing Library
- Mock API calls with MSW (Mock Service Worker)
- Mock Socket.io events for real-time features

## Common Gotchas

- **Access Token Storage**: Token is stored in-memory only (not localStorage). Refreshes on page reload via refresh token cookie.
- **Query Invalidation**: Always invalidate queries after mutations to keep UI in sync. Use query keys from `src/lib/queryKeys.js`.
- **Socket.io Connection**: Socket connects only when authenticated. Check `isAuthenticated` before using `getSocket()`.
- **Form Validation**: TanStack Form with Zod runs validation on change. Errors appear in `field.state.meta.errors`.
- **Image URLs**: Use `resolveImageUrl()` to handle both Cloudinary URLs and local uploads.
- **Protected Routes**: `ProtectedRoute` waits for `authChecked` before rendering. Don't check `isAuthenticated` before `authChecked` is true.
- **API Base URL**: All API calls go through `apiClient` which uses `VITE_API_URL`. Don't hardcode backend URLs.
