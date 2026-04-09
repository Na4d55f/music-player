import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiMusic, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const passwordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
  return { score, label: labels[score] || 'Weak', color: colors[score] };
};

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! Welcome to MusicStream!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-purple">
            <FiMusic size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Join MusicStream</h1>
          <p className="text-white/40 mt-2">Create your free account and start listening.</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['Free to use', 'No ads', 'Unlimited playlists'].map((benefit) => (
            <div key={benefit} className="glass-card rounded-lg p-2 text-center">
              <FiCheck size={14} className="text-accent mx-auto mb-1" />
              <span className="text-xs text-white/60">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-white/60 mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="text"
                  placeholder="cooluser123"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-field pl-11"
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  title="Only letters, numbers, and underscores"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          strength.score >= i ? 'bg-accent' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${strength.color}`}>{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="input-field pl-11"
                  required
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <FiCheck size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-xs text-white/25 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="mt-5 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
