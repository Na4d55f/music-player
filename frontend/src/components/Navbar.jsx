import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiMusic, FiHome, FiHeart, FiList, FiUser, FiCompass, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const navLinks = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/browse', icon: FiCompass, label: 'Browse' },
  { to: '/search', icon: FiSearch, label: 'Search' },
  { to: '/playlists', icon: FiList, label: 'Playlists', auth: true },
  { to: '/favorites', icon: FiHeart, label: 'Favorites', auth: true },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10 px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <FiMusic className="text-white text-sm" />
          </div>
          <span className="gradient-text">MusicStream</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label, auth }) => {
            if (auth && !isAuthenticated) return null;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(to) ? 'bg-primary/20 text-accent' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/search" className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <FiSearch size={18} />
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 glass-card hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-card border border-white/10 rounded-xl shadow-glass overflow-hidden z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <FiUser size={16} /> Profile
                  </Link>
                  <hr className="border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-1.5 px-3">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-dark-100 border-r border-white/10 flex flex-col pt-20 pb-4 px-4 animate-slide-in">
            {navLinks.map(({ to, icon: Icon, label, auth }) => {
              if (auth && !isAuthenticated) return null;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all
                    ${isActive(to) ? 'bg-primary/20 text-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}

            <div className="mt-auto pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-white/5 transition-all"
                >
                  <FiLogOut size={18} /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-accent hover:bg-white/5"
                >
                  <FiLogIn size={18} /> Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
