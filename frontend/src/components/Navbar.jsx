import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { favorites, playlists } = useMusic();

  const links = [
    { to: '/', label: '🏠 Home' },
    { to: '/search', label: '🔍 Search' },
    { to: '/playlists', label: `📋 Playlists (${playlists.length})` },
    { to: '/favorites', label: `❤️ Favorites (${favorites.length})` },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070710]/90 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          🎵 SoundWave
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-colors ${location.pathname === l.to ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400">Hi, {user.name}</span>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-red-400 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
      <div className="md:hidden flex gap-4 px-4 pb-2 overflow-x-auto">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-xs whitespace-nowrap transition-colors ${location.pathname === l.to ? 'text-purple-400' : 'text-gray-400'}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
