# 🎵 Music Streaming App

A complete, working music streaming website built with **React + Vite** on the frontend and **Express** on the backend. Streams real music from [Jamendo](https://www.jamendo.com) — thousands of free, CC-licensed tracks.

## ✨ Features

- 🎵 **Real Music Playback** — streams actual MP3s from Jamendo API
- 🔍 **Search** — search any song or artist in real-time
- 🔥 **Trending** — browse popular tracks sorted by plays
- 🎸 **Genre Filters** — Rock, Jazz, Electronic, Pop, Classical, Ambient, Hip-Hop
- 📋 **Playlists** — create, manage, and play playlists
- ❤️ **Favorites** — save and access your favourite songs
- 🕐 **Recently Played** — auto-tracked play history
- 🔐 **User Accounts** — login/register (localStorage-based)
- 🎨 **Dark Neon UI** — purple/cyan glassmorphism design
- 📱 **Responsive** — works on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone https://github.com/Na4d55f/music-player.git
cd music-player

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure environment

Copy the example env file:

```bash
cp .env.example frontend/.env
```

The default Jamendo client ID (`b6747d04`) is included and works out of the box.
Get your own free key at https://devportal.jamendo.com for production use.

### 3. Run the app

**Frontend only (recommended for quick start):**

```bash
cd frontend
npm run dev
```

Open http://localhost:5173 — you can search and play music immediately!

**Frontend + Backend together:**

```bash
npm run dev
```

This starts the backend on port 5000 and the frontend on port 5173.

## 📁 Project Structure

```
music-player/
├── frontend/               # Vite + React app
│   ├── src/
│   │   ├── api/            # Jamendo API client
│   │   ├── components/     # Navbar, Player, SongCard, Sidebar, ...
│   │   ├── context/        # MusicContext, AuthContext
│   │   └── pages/          # Home, Search, Playlists, Favorites, Login
│   ├── index.html
│   └── package.json
├── backend/                # Express API (Jamendo proxy)
│   ├── server.js
│   └── package.json
├── .env.example
└── package.json
```

## 🎵 How to Use

1. **Listen to music** — click any song on the Home page to start playing
2. **Search** — go to Search and type any song name or artist
3. **Genres** — use the genre buttons on Home to filter by style
4. **Playlists** — go to Playlists, create a playlist, then add songs
5. **Favorites** — click the ❤️ on any song to save it
6. **Account** — click Login to create a local profile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP | Axios |
| Music API | Jamendo API v3 |
| State | React Context API |
| Persistence | localStorage |
| Backend | Express.js |

## 📄 License

MIT License — free to use, modify, and distribute.