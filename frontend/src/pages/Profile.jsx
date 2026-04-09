import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEdit2, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, getRecentlyPlayed } from '../services/userAPI';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useMusic } from '../context/MusicContext';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const { playSong } = useMusic();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRecentlyPlayed()
      .then((data) => setRecentlyPlayed(data.recentlyPlayed || []))
      .catch(() => {});
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateProfile(profileForm);
      updateUserState(data.user);
      setEditingProfile(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setEditingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <FiUser className="text-accent" /> Profile
      </h1>

      {/* Avatar & Basic Info */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.username}</h2>
            <p className="text-white/50 text-sm">{user?.email}</p>
            {user?.bio && <p className="text-white/60 text-sm mt-1">{user?.bio}</p>}
          </div>
        </div>

        {editingProfile ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="input-field"
                maxLength={30}
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="input-field resize-none h-20"
                maxLength={200}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditingProfile(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 btn-secondary text-sm">
            <FiEdit2 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Password */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <FiLock size={16} className="text-accent" /> Password
          </h3>
          {!editingPassword && (
            <button onClick={() => setEditingPassword(true)} className="btn-ghost text-sm">
              Change
            </button>
          )}
        </div>

        {editingPassword ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="input-field"
              minLength={6}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="input-field"
              required
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditingPassword(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-white/30 text-sm">••••••••••</p>
        )}
      </div>

      {/* Account Info */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FiMail size={16} className="text-accent" /> Account Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Email</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Member since</span>
            <span className="text-white text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Role</span>
            <span className="text-accent text-sm capitalize">{user?.role || 'user'}</span>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiClock size={16} className="text-accent" /> Recently Played
          </h3>
          <div className="space-y-2">
            {recentlyPlayed.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => playSong({ id: item.songId, name: item.songName, artist: item.artist, image: item.image })}
              >
                <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.songName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                      <FiClock size={12} className="text-white/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.songName}</p>
                  <p className="text-xs text-white/40 truncate">{item.artist}</p>
                </div>
                <span className="text-xs text-white/20">
                  {new Date(item.playedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-24" />
    </div>
  );
};

export default Profile;
