import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A1A2E] rounded-2xl p-8 border border-purple-900/30">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back 🎵</h1>
        <p className="text-gray-400 mb-8">Login to your account</p>
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0F0F1A] text-white border border-purple-900/30 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0F0F1A] text-white border border-purple-900/30 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">Sign Up</Link>
        </p>
        <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-900/30">
          <p className="text-xs text-gray-400">Demo: Register first, then login with those credentials</p>
        </div>
      </div>
    </div>
  );
}
