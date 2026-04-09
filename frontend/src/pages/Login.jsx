import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="max-w-md mx-auto pt-12 space-y-6">
        <div className="glass-card p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-3xl font-bold mx-auto">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name || 'Music Lover'}</h2>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Link to="/" className="btn-primary block text-center">Browse Music</Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="btn-ghost text-red-400 hover:text-red-300 w-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { setError('Name is required'); return; }
        register(email, password, name);
      } else {
        login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-12">
      <div className="glass-card p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <span className="text-3xl font-bold gradient-text">SoundWave</span>
          <p className="text-white/40 text-sm mt-1">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                mode === m ? 'bg-purple-700 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-white/60 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-white/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-white/30">
          Demo app – credentials stored in localStorage only.
        </p>
      </div>
    </div>
  );
}
