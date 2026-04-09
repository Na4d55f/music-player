import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 glass-card rounded-none border-b border-white/5 flex items-center justify-between px-4 py-3">
      <span className="text-xl font-bold gradient-text">SoundWave</span>
      <nav className="flex gap-4">
        {[
          { to: '/', label: '🏠' },
          { to: '/search', label: '🔍' },
          { to: '/playlists', label: '📋' },
          { to: '/favorites', label: '❤️' },
          { to: '/profile', label: '👤' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `text-xl transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
