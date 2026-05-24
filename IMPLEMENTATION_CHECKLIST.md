# DevTribe Frontend Implementation Checklist

Use this checklist to track your integration progress from start to finish.

---

## 📖 Phase 1: Documentation & Understanding (30 min)

### Read Documentation

- [ ] Read `README_INTEGRATION.md` (master index)
- [ ] Skim `API_INTEGRATION_GUIDE.md` (understand endpoints)
- [ ] Read `ARCHITECTURE_GUIDE.md` (understand patterns)
- [ ] Bookmark `QUICK_START_GUIDE.md` (for daily reference)

### Understand Architecture

- [ ] Review recommended folder structure
- [ ] Understand React Query benefits
- [ ] Learn query key factory pattern
- [ ] Understand cache invalidation strategy
- [ ] Study optimistic update pattern

### Review Examples

- [ ] Look at `EXAMPLE_FEED_PAGE.jsx` (posts listing)
- [ ] Look at `EXAMPLE_POST_DETAIL_PAGE.jsx` (comments)
- [ ] Look at `EXAMPLE_COMMUNITIES_PAGE.jsx` (communities)

---

## 🔧 Phase 2: Setup & Configuration (30 min)

### Environment Setup

- [ ] Verify Node.js and npm installed
- [ ] Install dependencies: `npm install`
- [ ] Check `.env` has `VITE_API_URL=http://localhost:5000/api/v1`

### Create Folder Structure

- [ ] Create `src/hooks/` folder
- [ ] Create `src/services/` folder (if not exists)
- [ ] Create `src/utils/` folder (if not exists)
- [ ] Create `src/lib/` folder (if not exists)

### Copy Core Files

- [ ] Copy `src/services/apiCommunities.js`
- [ ] Copy `src/services/apiPosts.js`
- [ ] Copy `src/services/apiComments.js`
- [ ] Copy `src/services/apiVotes.js`
- [ ] Copy `src/utils/errorHandler.js`

### Copy Hook Files

- [ ] Copy `src/hooks/useAuthQueries.js`
- [ ] Copy `src/hooks/useCommunityQueries.js`
- [ ] Copy `src/hooks/usePostQueries.js`
- [ ] Copy `src/hooks/useCommentQueries.js`

### Update Configuration

- [ ] Update `src/lib/queryKeys.js` with new structure
- [ ] Ensure `src/lib/queryClient.js` is properly configured
- [ ] Verify React Query provider in `src/main.jsx`:

  ```javascript
  import { QueryClientProvider } from "@tanstack/react-query";
  import { queryClient } from "./lib/queryClient";

  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>;
  ```

- [ ] Add error handler import test: `import { getErrorMessage } from "./utils/errorHandler"`

---

## 🔐 Phase 3: Authentication (1 hour)

### Login Page

- [ ] Create `src/features/auth/pages/LoginPage.jsx`
- [ ] Copy pattern from docs (or create new)
- [ ] Import `useLogin` from `useAuthQueries`
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Show error messages using `getErrorMessage`
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Verify user data is cached
- [ ] Redirect to home after successful login

### Register Page

- [ ] Create `src/features/auth/pages/RegisterPage.jsx`
- [ ] Import `useRegister` from `useAuthQueries`
- [ ] Handle validation errors
- [ ] Handle network errors
- [ ] Test registration flow
- [ ] Test duplicate email error
- [ ] Verify redirect to login after registration

### Logout

- [ ] Add logout button to header/nav
- [ ] Import `useLogout` from `useAuthQueries`
- [ ] Verify all cached data is cleared
- [ ] Verify redirect to login/home
- [ ] Test logout clears all queries

### Get Current User

- [ ] Add `useCurrentUser()` to auth context or layout
- [ ] Verify user info is displayed
- [ ] Test user persists on page reload
- [ ] Test unauthorized redirects to login

### Protected Routes

- [ ] Create protected route component (if not exists)
- [ ] Use `useCurrentUser` to check auth
- [ ] Redirect unauthenticated users to login
- [ ] Test protected pages require auth

---

## 📝 Phase 4: Posts (2 hours)

### Posts List / Feed

- [ ] Create `src/features/posts/pages/FeedPage.jsx`
- [ ] Copy from `EXAMPLE_FEED_PAGE.jsx` or create new
- [ ] Import `useFeed` or `useListPosts` from `usePostQueries`
- [ ] Handle loading state with skeleton
- [ ] Handle empty state
- [ ] Handle error state
- [ ] Display posts list
- [ ] Test pagination (change pages)
- [ ] Verify `keepPreviousData` prevents UI flashing

### Post Detail

- [ ] Create `src/features/posts/pages/PostDetailPage.jsx`
- [ ] Copy from `EXAMPLE_POST_DETAIL_PAGE.jsx` or create new
- [ ] Import `usePost` from `usePostQueries`
- [ ] Display post title, content, author, date
- [ ] Display post image (if any)
- [ ] Handle loading state
- [ ] Test fetching post by ID
- [ ] Verify cached post detail
- [ ] Test invalid post ID (404 handling)

### Create Post

- [ ] Create `src/features/posts/pages/CreatePostPage.jsx`
- [ ] Create post form component
- [ ] Import `useCreatePost` from `usePostQueries`
- [ ] Handle text input (title, content)
- [ ] Handle image upload (FormData)
- [ ] Handle community selection
- [ ] Handle draft/publish toggle
- [ ] Test post creation
- [ ] Verify cache invalidation (feed updates)
- [ ] Test error handling (validation errors)

### Edit Post

- [ ] Add edit functionality to post detail
- [ ] Import `useUpdatePost` from `usePostQueries`
- [ ] Populate form with current data
- [ ] Handle image re-upload
- [ ] Test update
- [ ] Verify cache update
- [ ] Test permission (only author can edit)

### Delete Post

- [ ] Add delete button to post detail
- [ ] Import `useDeletePost` from `usePostQueries`
- [ ] Show confirmation dialog
- [ ] Test deletion
- [ ] Verify redirect after delete
- [ ] Test permission (only author can delete)

### Vote on Posts

- [ ] Add upvote/downvote buttons to posts
- [ ] Import `useVotePost` from `usePostQueries`
- [ ] Show current vote count
- [ ] Show user's vote (if authenticated)
- [ ] Test upvoting
- [ ] Test downvoting
- [ ] Test vote removal (click same button again)
- [ ] Verify optimistic update (instant UI change)
- [ ] Verify vote count updates correctly
- [ ] Test error handling and rollback

---

## 💬 Phase 5: Comments (1.5 hours)

### Comments List

- [ ] Add comments section to post detail
- [ ] Import `useListComments` from `useCommentQueries`
- [ ] Display comments with pagination
- [ ] Show comment author, date, content
- [ ] Handle loading state
- [ ] Handle empty state (no comments)
- [ ] Test pagination

### Create Comment

- [ ] Add comment form to post detail
- [ ] Import `useCreateComment` from `useCommentQueries`
- [ ] Handle textarea input
- [ ] Test comment creation
- [ ] Verify optimistic UI (comment appears immediately)
- [ ] Verify cache invalidation (comment count updates)
- [ ] Test error handling
- [ ] Test unauthenticated users can't comment

### Edit Comment

- [ ] Add edit button to each comment
- [ ] Import `useUpdateComment` from `useCommentQueries`
- [ ] Show edit form (toggle)
- [ ] Test update
- [ ] Verify cache update
- [ ] Test permission (only author can edit)
- [ ] Test cancel edit

### Delete Comment

- [ ] Add delete button to each comment
- [ ] Import `useDeleteComment` from `useCommentQueries`
- [ ] Show confirmation
- [ ] Test deletion
- [ ] Verify cache update (comment list)
- [ ] Test permission (only author can delete)

### Vote on Comments

- [ ] Add upvote/downvote to each comment
- [ ] Import `useVoteComment` from `useCommentQueries`
- [ ] Show vote counts
- [ ] Show user's vote (if authenticated)
- [ ] Test voting (optimistic + server sync)
- [ ] Test vote removal
- [ ] Verify cache updates
- [ ] Test error handling

---

## 🏘️ Phase 6: Communities (1.5 hours)

### Communities List

- [ ] Create `src/features/communities/pages/CommunitiesPage.jsx`
- [ ] Copy from `EXAMPLE_COMMUNITIES_PAGE.jsx` or create new
- [ ] Import `useListCommunities` from `useCommunityQueries`
- [ ] Display communities in grid/list
- [ ] Show community info (name, description, member count)
- [ ] Handle loading state
- [ ] Handle empty state
- [ ] Test pagination

### Search Communities

- [ ] Add search input to communities page
- [ ] Import `useDebouncedValue` from hooks
- [ ] Implement 500ms debounce on search
- [ ] Test search filtering
- [ ] Verify API isn't called on every keystroke
- [ ] Test search with results
- [ ] Test search with no results

### Community Detail

- [ ] Create community detail page
- [ ] Import `useCommunity` from `useCommunityQueries`
- [ ] Display community info (banner, name, description)
- [ ] Display member list
- [ ] Show member roles (admin, moderator, member)
- [ ] Display posts from community
- [ ] Handle loading state
- [ ] Test fetching community details

### Join Community

- [ ] Add join button to community card/detail
- [ ] Import `useJoinCommunity` from `useCommunityQueries`
- [ ] Test joining community
- [ ] Verify optimistic UI (button shows "Joined" immediately)
- [ ] Verify cache update (community detail updates)
- [ ] Verify community list shows joined status
- [ ] Test error handling (already member, etc.)

### Leave Community

- [ ] Add leave button to joined communities
- [ ] Import `useLeaveCommunity` from `useCommunityQueries`
- [ ] Show confirmation
- [ ] Test leaving
- [ ] Verify UI updates (button changes to "Join")
- [ ] Verify cache updates
- [ ] Test error handling

### Create Community

- [ ] Create community form (optional, admin feature)
- [ ] Import `useCreateCommunity` from `useCommunityQueries`
- [ ] Handle form inputs (name, slug, description)
- [ ] Test creation
- [ ] Verify duplicate slug error (409)
- [ ] Verify cache invalidation (communities list updates)
- [ ] Test error handling

### Manage Community (Admin)

- [ ] Add member management UI (if admin)
- [ ] Import `useUpdateMemberRole` from `useCommunityQueries`
- [ ] Test updating member role
- [ ] Verify cache update
- [ ] Test error handling (permission denied)

---

## 🎨 Phase 7: Polish & Testing (1.5 hours)

### Error Handling

- [ ] Add error boundaries to pages
- [ ] Test 400 (validation) errors
- [ ] Test 401 (unauthorized) errors → redirect to login
- [ ] Test 403 (forbidden) errors → show permission message
- [ ] Test 404 (not found) errors → show not found page
- [ ] Test 409 (conflict) errors → show specific message
- [ ] Test 429 (rate limit) errors → show wait message
- [ ] Test 5xx (server) errors → show server error
- [ ] Test network errors → show retry button

### Loading States

- [ ] Add skeleton loaders for lists
- [ ] Add skeleton loaders for detail pages
- [ ] Test loading states display correctly
- [ ] Test loading states clear when data arrives
- [ ] Test loading states on refresh

### Empty States

- [ ] Add empty state for posts list
- [ ] Add empty state for comments list
- [ ] Add empty state for communities list
- [ ] Add empty state when search has no results
- [ ] Add empty state for user's drafts

### User Feedback

- [ ] Add toast notifications for:
  - [ ] Post created successfully
  - [ ] Comment posted successfully
  - [ ] Joined community
  - [ ] Left community
  - [ ] Voted on post
  - [ ] Error messages

### Performance

- [ ] Verify stale times are appropriate
- [ ] Test `keepPreviousData` for pagination
- [ ] Verify debounce is working for search
- [ ] Test optimistic updates feel instant
- [ ] Check Network tab for unnecessary requests
- [ ] Use React Query DevTools to inspect cache

### Responsive Design

- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (641px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test touch interactions (voting, buttons)
- [ ] Test scroll behavior
- [ ] Test menu/navigation on mobile

### Cross-Browser Testing

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify localStorage works
- [ ] Verify cookies work

### Accessibility

- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify form labels
- [ ] Test screen reader (NVDA/JAWS)
- [ ] Verify color contrast
- [ ] Test focus indicators

---

## 🧪 Phase 8: Testing (1 hour)

### Unit Tests

- [ ] Test error handler functions
- [ ] Test API service functions
- [ ] Test hook logic (stale state, etc.)

### Integration Tests

- [ ] Test login flow end-to-end
- [ ] Test post creation flow
- [ ] Test comment on post
- [ ] Test join community flow

### E2E Tests (Optional)

- [ ] Test full user journey (signup → post → vote → comment)
- [ ] Test error scenarios
- [ ] Test performance under load

### Manual Testing Scenarios

- [ ] Open app, log in, create post, vote, comment, logout
- [ ] Create post, navigate away, come back → verify cache
- [ ] Vote on post, close app, reopen → verify vote persists
- [ ] Search communities, join, navigate to community detail
- [ ] Create multiple posts, paginate through them
- [ ] Edit post while other users are viewing it
- [ ] Vote then refresh page → verify vote still shows

---

## 📋 Phase 9: Documentation & Handoff (30 min)

### Document Your Code

- [ ] Add JSDoc comments to custom components
- [ ] Add comments for complex logic
- [ ] Document custom hooks in use
- [ ] Document any deviations from examples

### Create Setup Guide

- [ ] Document environment variables needed
- [ ] Document backend API requirements
- [ ] Document how to run dev server
- [ ] Document how to run tests

### Create User Guide

- [ ] Document user flows (login, create post, etc.)
- [ ] Take screenshots of main features
- [ ] Document any non-obvious features

### Prepare for Deployment

- [ ] Verify environment variables for production
- [ ] Test production build: `npm run build`
- [ ] Verify no console errors/warnings
- [ ] Check bundle size
- [ ] Set up CI/CD (if needed)

---

## 🚀 Pre-Launch Checklist

### Functionality

- [ ] All endpoints working (verified with Network tab)
- [ ] All CRUD operations working
- [ ] Voting working with optimistic updates
- [ ] Pagination working
- [ ] Search working
- [ ] Error handling working

### Performance

- [ ] No unnecessary re-renders
- [ ] Cache working correctly
- [ ] Optimistic updates feel instant
- [ ] Pagination doesn't flash
- [ ] No memory leaks

### User Experience

- [ ] Loading states clear and informative
- [ ] Error messages helpful
- [ ] Toasts/notifications working
- [ ] Keyboard navigation works
- [ ] Touch targets adequate size (mobile)

### Security

- [ ] Tokens stored securely (HTTP-only cookies)
- [ ] Protected routes actually protected
- [ ] CSRF tokens if applicable
- [ ] No sensitive data in console/logs
- [ ] API validates all requests

### Code Quality

- [ ] No console errors
- [ ] No console warnings
- [ ] No unused imports
- [ ] Consistent code style
- [ ] Comments where needed

---

## 📊 Progress Tracking

### Completion Percentages

```
Phase 1: Documentation     [ ] 0%   → [✓] 100%
Phase 2: Setup             [ ] 0%   → [✓] 100%
Phase 3: Auth              [ ] 0%   → [✓] 100%
Phase 4: Posts             [ ] 0%   → [✓] 100%
Phase 5: Comments          [ ] 0%   → [✓] 100%
Phase 6: Communities       [ ] 0%   → [✓] 100%
Phase 7: Polish            [ ] 0%   → [✓] 100%
Phase 8: Testing           [ ] 0%   → [✓] 100%
Phase 9: Documentation     [ ] 0%   → [✓] 100%
---
TOTAL:                     [ ] 0%   → [✓] 100%
```

---

## 🎯 Success Criteria

### MVP (Minimum Viable Product)

- [x] Users can register and login
- [x] Users can create and view posts
- [x] Users can comment on posts
- [x] Users can vote on posts and comments
- [x] Users can join communities

### Nice to Have

- [x] Search communities
- [x] Edit/delete own posts
- [x] Edit/delete own comments
- [x] Pagination for lists
- [x] Loading skeletons

### Production Ready

- [x] Error boundaries
- [x] Loading states
- [x] Empty states
- [x] User feedback (toasts)
- [x] Optimistic updates
- [x] Accessible (a11y)
- [x] Responsive (mobile/tablet/desktop)
- [x] Performance optimized

---

## 🎓 Next Steps After Launch

1. Monitor user feedback and errors
2. Optimize performance based on analytics
3. Add new features (bookmarks, notifications, messaging)
4. Improve UI/UX based on user feedback
5. Scale infrastructure as needed

---

## 📞 Support

If you get stuck:

1. Check `QUICK_START_GUIDE.md` for quick patterns
2. Review `ARCHITECTURE_GUIDE.md` for best practices
3. Look at example components for working code
4. Check React Query docs: https://tanstack.com/query/latest
5. Check Axios docs: https://axios-http.com/

---

**Good luck! You've got this! 🚀**

Mark this checklist as you progress and celebrate each phase completion!
