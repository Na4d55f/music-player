# 🎵 SoundWave - Music Streaming Platform

A complete, production-ready music streaming web application built with React, Node.js, Express, and MongoDB.

## ✨ Features

- 🎵 **52+ Songs** - Stream royalty-free music from 20 artists across 19 genres
- 🎧 **Full Music Player** - Play, pause, next, previous, shuffle, repeat, volume control
- 🔍 **Search** - Find songs, artists, albums, and genres instantly
- 📋 **Playlists** - Create, manage, and play your own playlists
- ❤️ **Favorites** - Like and save your favorite songs
- 👤 **User Authentication** - Register and login with JWT tokens
- 🎨 **Dark Theme** - Beautiful dark UI with purple/blue neon accents
- 💎 **Glassmorphism** - Modern glass-effect design elements
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Na4d55f/music-player.git
cd music-player
```

### 2. Install all dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Set up environment variables
```bash
# Backend (optional - works without MongoDB)
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI (optional)

# Frontend (optional - uses mock data fallback)
# VITE_API_URL=/api  # default, no change needed
```

### 4. Run locally
```bash
# Run both frontend and backend simultaneously
npm run dev

# Or run separately:
# Terminal 1 - Backend:
cd backend && npm start

# Terminal 2 - Frontend:
cd frontend && npm run dev
```

### 5. Open in browser
Visit: **http://localhost:5173**

> **Note:** The app works completely standalone without a backend! It uses mock data with real SoundHelix audio streams for music playback.

## 🌐 Deployment

### Frontend (Vercel) - Recommended
1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set **Root Directory** to `frontend`
4. Deploy! ✅

### Backend (Railway)
1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set the working directory to `backend`
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
5. Deploy! ✅

### Database (MongoDB Atlas)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add to Railway environment variables

### Docker (Self-hosted)
```bash
cp backend/.env.example backend/.env
# Edit .env with your values
docker-compose up -d
```

## 📁 Project Structure

```
music-player/
├── README.md
├── package.json              # Root workspace config
├── .gitignore
├── vercel.json               # Vercel deployment config
├── docker-compose.yml        # Docker setup
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── MusicPlayer.jsx
│       │   ├── SearchBar.jsx
│       │   ├── SongCard.jsx
│       │   ├── ArtistCard.jsx
│       │   ├── PlaylistCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Toast.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Search.jsx
│       │   ├── Browse.jsx
│       │   ├── Favorites.jsx
│       │   ├── Playlists.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── NotFound.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── MusicContext.jsx
│       │   └── UIContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useMusic.js
│       │   └── useTheme.js
│       └── services/
│           ├── api.js
│           ├── musicAPI.js
│           ├── authAPI.js
│           └── userAPI.js
└── backend/                  # Node.js + Express
    ├── package.json
    ├── server.js
    ├── Procfile              # Heroku config
    ├── Dockerfile
    ├── .env.example
    ├── config/
    │   └── db.js
    ├── data/
    │   └── songs.js          # 52+ songs mock data
    ├── models/
    │   ├── User.js
    │   └── Playlist.js
    ├── routes/
    │   ├── auth.js
    │   ├── music.js
    │   ├── playlists.js
    │   └── users.js
    └── middleware/
        ├── auth.js
        ├── errorHandler.js
        └── validation.js (not used)
```

## 🎵 Music

All music is streamed from [SoundHelix](https://www.soundhelix.com/) - royalty-free synthetic music tracks perfect for demonstration. Cover art is from [Picsum Photos](https://picsum.photos/).

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/music/songs` | Get all songs |
| GET | `/api/music/songs/trending` | Get trending songs |
| GET | `/api/music/songs/recent` | Get recently added |
| GET | `/api/music/songs/:id` | Get specific song |
| GET | `/api/music/artists` | Get all artists |
| GET | `/api/music/search?q=query` | Search music |
| GET | `/api/music/genres` | Get all genres |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/playlists` | Get user playlists |
| POST | `/api/playlists` | Create playlist |
| POST | `/api/playlists/:id/songs` | Add song to playlist |
| GET | `/api/users/favorites` | Get favorite songs |
| POST | `/api/users/favorites/:id` | Toggle favorite |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Context API + useReducer |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js, Express |
| Auth | JWT, bcryptjs |
| Database | MongoDB + Mongoose (optional) |
| Security | Helmet, CORS, Rate limiting |
| Deployment | Vercel + Railway / Docker |

## 📄 License

MIT License - see LICENSE for details.
