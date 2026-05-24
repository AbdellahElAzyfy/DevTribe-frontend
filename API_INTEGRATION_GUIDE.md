# DevTribe API Integration Guide

## Base URL

```
http://localhost:5000/api/v1  (development)
```

## Authentication

- Uses **Bearer tokens** (JWT in Authorization header)
- **Refresh tokens** stored in cookies (HttpOnly)
- All endpoints except Auth require authentication (except `/posts` and `/posts/:postId`)

---

## 1. AUTH ENDPOINTS

### Register

```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string|null"
  },
  "accessToken": "string"
}
```

### Login

```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string|null"
  },
  "accessToken": "string"
}
```

### Get Current User

```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "id": "string",
  "username": "string",
  "email": "string",
  "avatar": "string|null",
  "createdAt": "ISO string"
}
```

### Update Profile

```
PATCH /auth/me
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "username": "string (optional)",
  "email": "string (optional)",
  "avatar": "file (optional)"
}

Response (200):
{
  "user": { ...updated user }
}
```

### Change Password

```
PATCH /auth/me/password
Authorization: Bearer {token}

Request:
{
  "currentPassword": "string",
  "newPassword": "string"
}

Response (200):
{
  "message": "Password changed successfully"
}
```

### Logout

```
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logged out successfully"
}
```

### Refresh Token

```
POST /auth/refresh

Response (200):
{
  "message": "Session refreshed",
  "user": {...},
  "accessToken": "string"
}
```

---

## 2. COMMUNITIES ENDPOINTS

### List All Communities

```
GET /communities

Query Params:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- search: string (optional)

Response (200):
{
  "communities": [
    {
      "id": "string",
      "slug": "string",
      "name": "string",
      "description": "string",
      "icon": "string|null",
      "members": [
        {
          "userId": "string",
          "role": "admin|moderator|member",
          "joinedAt": "ISO string"
        }
      ],
      "memberCount": number,
      "createdAt": "ISO string"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

### Get Community by Slug

```
GET /communities/:slug

Response (200):
{
  "community": {
    "id": "string",
    "slug": "string",
    "name": "string",
    "description": "string",
    "icon": "string|null",
    "members": [...],
    "memberCount": number,
    "createdAt": "ISO string"
  }
}
```

### Create Community

```
POST /communities
Authorization: Bearer {token}

Request:
{
  "name": "string",
  "description": "string",
  "slug": "string (unique, lowercase)"
}

Response (201):
{
  "message": "Community created successfully",
  "community": { ...new community }
}
```

### Join Community

```
POST /communities/:slug/join
Authorization: Bearer {token}

Response (200):
{
  "message": "Joined community",
  "community": { ...updated community with user added to members }
}
```

### Leave Community

```
POST /communities/:slug/leave
Authorization: Bearer {token}

Response (200):
{
  "message": "Left community",
  "community": { ...updated community with user removed from members }
}
```

### Delete Community

```
DELETE /communities/:slug
Authorization: Bearer {token}

Response (200):
{
  "message": "Community deleted successfully"
}
```

### Update Member Role

```
PATCH /communities/:slug/members/:memberId/role
Authorization: Bearer {token}

Request:
{
  "role": "admin|moderator|member"
}

Response (200):
{
  "message": "Member role updated",
  "community": { ...updated community }
}
```

---

## 3. POSTS ENDPOINTS

### List All Posts

```
GET /posts

Query Params:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- sortBy: "trending|recent|popular" (optional, default: "trending")
- community: string (optional, community slug)
- search: string (optional)

Response (200):
{
  "posts": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "image": "string|null",
      "isDraft": boolean,
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string|null"
      },
      "community": {
        "id": "string",
        "slug": "string",
        "name": "string"
      },
      "votes": {
        "upvotes": number,
        "downvotes": number,
        "userVote": "up|down|null" (only if authenticated)
      },
      "commentsCount": number,
      "createdAt": "ISO string"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

### Get User's Feed

```
GET /posts/feed
Authorization: Bearer {token}

Query Params:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- sortBy: "trending|recent|popular" (optional)

Response (200):
{
  "posts": [...],
  "pagination": {...}
}
```

### Get User's Drafts

```
GET /posts/me/drafts
Authorization: Bearer {token}

Query Params:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)

Response (200):
{
  "posts": [...],
  "pagination": {...}
}
```

### Get Post by ID

```
GET /posts/:postId

Response (200):
{
  "post": {
    "id": "string",
    "title": "string",
    "content": "string",
    "image": "string|null",
    "isDraft": boolean,
    "author": {...},
    "community": {...},
    "votes": {...},
    "commentsCount": number,
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

### Create Post

```
POST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "title": "string",
  "content": "string",
  "communitySlug": "string",
  "image": "file (optional)",
  "isDraft": boolean (optional, default: false)
}

Response (201):
{
  "message": "Post created successfully",
  "post": {...new post}
}
```

### Update Post

```
PATCH /posts/:postId
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "title": "string (optional)",
  "content": "string (optional)",
  "communitySlug": "string (optional)",
  "image": "file (optional)",
  "isDraft": boolean (optional)
}

Response (200):
{
  "message": "Post updated successfully",
  "post": {...updated post}
}
```

### Delete Post

```
DELETE /posts/:postId
Authorization: Bearer {token}

Response (200):
{
  "message": "Post deleted successfully"
}
```

### Vote on Post

```
POST /posts/:postId/vote
Authorization: Bearer {token}

Request:
{
  "value": "up|down|null"  // null to remove vote
}

Response (200):
{
  "message": "Post vote recorded",
  "vote": {
    "id": "string",
    "userId": "string",
    "targetType": "post",
    "targetId": "string",
    "value": "up|down",
    "createdAt": "ISO string"
  }
}
```

---

## 4. COMMENTS ENDPOINTS

### List Comments by Post

```
GET /comments/post/:postId

Query Params:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- sortBy: "trending|recent" (optional)

Response (200):
{
  "comments": [
    {
      "id": "string",
      "content": "string",
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string|null"
      },
      "votes": {
        "upvotes": number,
        "downvotes": number,
        "userVote": "up|down|null" (only if authenticated)
      },
      "createdAt": "ISO string",
      "updatedAt": "ISO string"
    }
  ],
  "pagination": {...}
}
```

### Create Comment

```
POST /comments/post/:postId
Authorization: Bearer {token}

Request:
{
  "content": "string"
}

Response (201):
{
  "message": "Comment created successfully",
  "comment": {...new comment}
}
```

### Update Comment

```
PATCH /comments/:commentId
Authorization: Bearer {token}

Request:
{
  "content": "string"
}

Response (200):
{
  "message": "Comment updated successfully",
  "comment": {...updated comment}
}
```

### Delete Comment

```
DELETE /comments/:commentId
Authorization: Bearer {token}

Response (200):
{
  "message": "Comment deleted successfully"
}
```

### Vote on Comment

```
POST /comments/:commentId/vote
Authorization: Bearer {token}

Request:
{
  "value": "up|down|null"
}

Response (200):
{
  "message": "Comment vote recorded",
  "vote": {...}
}
```

---

## Error Responses

All error responses follow this format:

```
{
  "error": {
    "message": "string",
    "statusCode": number,
    "details": "string (optional)"
  }
}
```

Common Status Codes:

- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate slug, etc.)
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error
