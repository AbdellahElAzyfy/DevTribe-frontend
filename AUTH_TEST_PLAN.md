# Auth Edge-Case Test Plan

## Preconditions
- Backend base URL is set in `.env` as `VITE_API_URL=http://localhost:<port>/api/v1`.
- Refresh token cookie is `HttpOnly` and sent on same-site requests.

## Core Flows
1. Login success
- Submit valid credentials.
- Expect redirect to `/home`.
- Expect protected API calls to include `Authorization: Bearer <accessToken>`.

2. Register success
- Submit valid registration data.
- Expect redirect to `/home`.
- Expect authenticated state and user profile available.

3. Bootstrap with valid refresh cookie
- Clear access token in storage but keep refresh cookie.
- Reload app.
- Expect automatic session restore (`refresh -> me`) and access to protected routes.

4. Bootstrap without refresh cookie
- Clear access token and refresh cookie.
- Reload app at a protected URL (for example `/profile`).
- Expect redirect to `/login` after auth check completes.

## 401 / Refresh Behavior
5. Expired access token, valid refresh token
- Force access token to expire.
- Trigger a protected request.
- Expect one refresh call, one request retry, and successful response.

6. Expired access token, invalid refresh token
- Force both access and refresh invalid.
- Trigger a protected request.
- Expect refresh failure, cleared local session, redirect to `/login`.

7. No retry loop
- Keep backend returning 401 for a protected request after refresh.
- Expect only one retry attempt for that request.

## Route Guards
8. Protected routes blocked when signed out
- Open `/home`, `/create-post`, `/saved` while signed out.
- Expect redirect to `/login`.

9. Public auth routes blocked when signed in
- Open `/login` or `/signup` while signed in.
- Expect redirect to `/home`.

## Logout
10. Backend logout + local cleanup
- Click logout.
- Expect `POST /auth/logout` request.
- Expect local auth state cleared and redirect to `/login`.
- Expect cached user data removed from React Query cache.

11. Logout backend failure fallback
- Simulate `POST /auth/logout` server failure.
- Expect frontend still clears local session and routes user to `/login`.
