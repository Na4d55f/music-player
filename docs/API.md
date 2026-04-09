# MusicStream API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require an `Authorization: Bearer <token>` header.

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "username": "cooluser",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 201:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "username": "cooluser", "email": "user@example.com" }
}
```

---

### POST /auth/login
Log in with email and password.

**Body:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Response 200:** Same as register.

---

### GET /auth/me *(Protected)*
Get the currently authenticated user.

---

### POST /auth/logout *(Protected)*
Log out (invalidates session client-side).

---

### POST /auth/forgot-password
Request a password reset email.

**Body:** `{ "email": "user@example.com" }`

---

### PUT /auth/reset-password/:token
Reset password with a valid reset token.

**Body:** `{ "password": "newpassword123" }`

---

## Music Endpoints

### GET /music/search
Search for music.

**Query params:**
- `q` (required) — search query
- `type` — `track` | `artist` | `album` (default: `track`)
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "track-mbid",
      "name": "Blinding Lights",
      "artist": "The Weeknd",
      "image": "https://...",
      "listeners": 8500000,
      "type": "track"
    }
  ],
  "total": 1500,
  "page": 1
}
```

---

### GET /music/trending
Get trending tracks.

**Query params:** `limit` (default: 20)

---

### GET /music/top-artists
Get top artists.

**Query params:** `limit` (default: 20)

---

### GET /music/artist/:name
Get detailed artist information including top tracks and similar artists.

---

### GET /music/album/:artist/:album
Get album info with track listing.

---

### GET /music/genre/:tag
Get top tracks for a specific genre/tag.

**Query params:** `limit` (default: 20)

---

## Playlist Endpoints

All playlist endpoints (except `GET /playlists/public`) require authentication.

### GET /playlists
Get current user's playlists.

### GET /playlists/public
Get all public playlists.

### GET /playlists/:id *(Protected)*
Get a specific playlist by ID.

### POST /playlists *(Protected)*
Create a new playlist.

**Body:**
```json
{
  "name": "My Playlist",
  "description": "Optional description",
  "isPublic": false
}
```

### PUT /playlists/:id *(Protected)*
Update a playlist (owner only).

### DELETE /playlists/:id *(Protected)*
Delete a playlist (owner only).

### POST /playlists/:id/songs *(Protected)*
Add a song to a playlist.

**Body:**
```json
{
  "songId": "unique-song-id",
  "name": "Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "image": "https://...",
  "duration": 210,
  "url": ""
}
```

### DELETE /playlists/:id/songs/:songId *(Protected)*
Remove a song from a playlist.

---

## User Endpoints

All user endpoints require authentication.

### GET /users/profile
Get current user's profile.

### PUT /users/profile
Update profile (username, bio, avatar).

### PUT /users/password
Change password.

**Body:** `{ "currentPassword": "...", "newPassword": "..." }`

### GET /users/favorites
Get list of favorited song IDs.

### POST /users/favorites/:songId
Add a song to favorites.

### DELETE /users/favorites/:songId
Remove a song from favorites.

### GET /users/recently-played
Get recently played songs (last 30).

### POST /users/recently-played
Add a song to recently played history.

**Body:** `{ "songId": "...", "songName": "...", "artist": "...", "image": "..." }`

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` — Bad request / validation error
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not found
- `409` — Conflict (duplicate)
- `429` — Rate limit exceeded
- `500` — Internal server error
