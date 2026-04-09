import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import Favorites from './pages/Favorites';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <div className="flex min-h-screen bg-primary text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              {/* Main content */}
              <main className="flex-1 px-4 py-6 md:px-8 md:py-8 mt-14 md:mt-0 pb-32 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/playlists/*" element={<Playlists />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Login />} />
                </Routes>
              </main>
            </div>
          </div>
          <Player />
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
