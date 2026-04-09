import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
  { to: '/playlists', label: 'Playlists', icon: PlaylistIcon },
  { to: '/favorites', label: 'Favorites', icon: HeartIcon },
];

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlaylistIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen glass-card rounded-none border-r border-white/5 pt-6 pb-32 shrink-0">
      {/* Logo */}
      <div className="px-6 mb-8">
        <span className="text-2xl font-bold gradient-text">SoundWave</span>
        <p className="text-xs text-white/40 mt-1">Music Streaming</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-purple-700/30 text-purple-300 neon-border'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="px-4 mt-6 border-t border-white/5 pt-4">
        {user ? (
          <NavLink
            to="/profile"
            className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-2 py-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-sm font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          </NavLink>
        ) : (
          <NavLink to="/login" className="btn-primary w-full block text-center text-sm">
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  );
}
