import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { userAPI } from '../services/userAPI.js';

export default function Profile() {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const { showToast } = useUI();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="glass rounded-2xl p-12 text-center animate-fade-in">
        <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-400 mb-2">Sign in to view your profile</h3>
        <p className="text-slate-600 text-sm">Create an account to save your playlists and favorites</p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await userAPI.updateProfile({ username, bio });
      updateUser({ ...user, ...updated, username: updated.username || username, bio: updated.bio || bio });
      showToast('Profile updated!');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">👤 Profile</h1>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.username}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-field"
              minLength={3}
              maxLength={30}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="input-field resize-none h-24"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <p className="text-xs text-slate-600 mt-1">{bio.length}/200</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : null}
            Save Changes
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-slate-400">Email</span>
            <span className="text-sm text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">Member since</span>
            <span className="text-sm text-white">{new Date().getFullYear()}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 w-full text-sm text-red-400 hover:text-red-300 py-2 px-4 rounded-xl hover:bg-red-500/10 transition-colors text-left flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
