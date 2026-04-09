import { NavLink } from 'react-router-dom';
import { useUI } from '../context/UIContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Home', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, exact: true },
  { to: '/search', label: 'Search', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { to: '/browse', label: 'Browse', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"/></svg> },
];

const authNavItems = [
  { to: '/favorites', label: 'Favorites', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { to: '/playlists', label: 'Playlists', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> },
  { to: '/profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-16 bottom-0 w-56 z-30
        glass-dark border-r border-white/10
        flex flex-col py-4 px-3 gap-1
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="mb-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-1">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        {isAuthenticated && (
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-1 mt-2">My Music</p>
            {authNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Genre quick links */}
        <div className="mt-auto">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-1">Genres</p>
          {['Electronic', 'Pop', 'Hip-Hop', 'Rock', 'Jazz'].map(genre => (
            <NavLink
              key={genre}
              to={`/browse?genre=${encodeURIComponent(genre)}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link text-sm ${isActive ? 'active' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
              {genre}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
