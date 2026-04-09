# Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- MongoDB 7.x (local or Atlas)
- npm >= 9.0.0
- A LastFM API key (optional — mock data used otherwise)

---

## Quick Start (Local Development)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd music-player
npm install   # installs root dev tools
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Required `.env` variables:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/musicplayer
JWT_SECRET=change_this_to_a_secure_random_string
```

**Optional:**
```
LASTFM_API_KEY=your_key   # Get free at https://www.last.fm/api/account/create
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Configure frontend

```bash
cd ../frontend
cp .env.example .env
# VITE_API_URL defaults to /api which proxies to backend
```

### 4. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5. Start development servers

Option A — From root:
```bash
npm run dev
```

Option B — Separately:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

---

## Docker Setup

```bash
cp .env.example .env  # configure your variables
docker-compose up -d
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

---

## Environment Variables Reference

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `JWT_EXPIRE` | No | JWT expiry (default: 7d) |
| `LASTFM_API_KEY` | No | LastFM API key for music data |
| `LASTFM_SECRET` | No | LastFM API secret |
| `EMAIL_HOST` | No | SMTP host for emails |
| `EMAIL_PORT` | No | SMTP port (default: 587) |
| `EMAIL_USER` | No | SMTP username |
| `EMAIL_PASS` | No | SMTP password |
| `FRONTEND_URL` | No | Frontend URL for CORS and emails |
| `NODE_ENV` | No | `development` or `production` |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: `/api`) |

---

## Getting a LastFM API Key

1. Create an account at https://www.last.fm
2. Go to https://www.last.fm/api/account/create
3. Fill in the application details
4. Copy your API key to `LASTFM_API_KEY`

Without an API key, the app uses mock/demo data.
