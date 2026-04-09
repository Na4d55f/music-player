import { useEffect, useState, useRef } from 'react';
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumex, FiShuffle, FiRepeat, FiHeart,
  FiChevronUp, FiChevronDown, FiMusic, FiList
} from 'react-icons/fi';
import { MdRepeatOne } from 'react-icons/md';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite } from '../services/userAPI';
import { toast } from 'react-toastify';

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const Player = () => {
  const {
    currentSong, isPlaying, volume, progress, duration,
    shuffle, repeat, isLoading,
    togglePlay, playNext, playPrev, seek, changeVolume,
    toggleShuffle, cycleRepeat, queue
  } = useMusic();
  const { isAuthenticated, user } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const progressRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && currentSong) {
      setIsFavorite(user.favorites?.includes(currentSong.id) || false);
    }
  }, [currentSong, user, isAuthenticated]);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(ratio * duration, duration)));
  };

  const handleMuteToggle = () => {
    if (muted) {
      changeVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      changeVolume(0);
    }
    setMuted((m) => !m);
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(currentSong.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(currentSong.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  if (!currentSong) return null;

  return (
    <>
      {/* Expanded Player Overlay */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fade-in">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
          >
            <FiChevronDown size={28} />
          </button>

          {/* Album Art */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 mb-8 relative">
            {currentSong.image ? (
              <img
                src={currentSong.image}
                alt={currentSong.name}
                className={`w-full h-full object-cover ${isPlaying ? 'vinyl-disk' : 'vinyl-disk paused'}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FiMusic size={64} className="text-white/50" />
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">{currentSong.name}</h2>
            <p className="text-white/60 text-lg">{currentSong.artist}</p>
            {currentSong.album && (
              <p className="text-white/40 text-sm mt-1">{currentSong.album}</p>
            )}
          </div>

          {/* Controls */}
          <div className="w-full max-w-md">
            {/* Progress */}
            <div
              className="progress-bar mb-3 cursor-pointer"
              onClick={handleProgressClick}
              ref={progressRef}
            >
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-white/40 mb-6">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={toggleShuffle}
                className={`p-2 transition-all ${shuffle ? 'text-accent' : 'text-white/40 hover:text-white'}`}
              >
                <FiShuffle size={20} />
              </button>

              <button onClick={playPrev} className="p-2 text-white/70 hover:text-white transition-all">
                <FiSkipBack size={24} />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow hover:opacity-90 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <FiPause size={28} className="text-white" />
                ) : (
                  <FiPlay size={28} className="text-white ml-1" />
                )}
              </button>

              <button onClick={playNext} className="p-2 text-white/70 hover:text-white transition-all">
                <FiSkipForward size={24} />
              </button>

              <button
                onClick={cycleRepeat}
                className={`p-2 transition-all ${repeat !== 'none' ? 'text-accent' : 'text-white/40 hover:text-white'}`}
              >
                {repeat === 'one' ? <MdRepeatOne size={20} /> : <FiRepeat size={20} />}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <button onClick={handleMuteToggle} className="text-white/40 hover:text-white transition-all">
                {muted || volume === 0 ? <FiVolumex size={18} /> : <FiVolume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mini Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/10 px-4 py-3">
        {/* Progress Bar on top */}
        <div
          className="progress-bar mb-3 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex items-center gap-4 max-w-screen-xl mx-auto">
          {/* Song Info */}
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              {currentSong.image ? (
                <img src={currentSong.image} alt={currentSong.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <FiMusic size={16} className="text-white/60" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentSong.name}</p>
              <p className="text-xs text-white/50 truncate">{currentSong.artist}</p>
            </div>
            <FiChevronUp size={16} className="text-white/40 flex-shrink-0 ml-1" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={`hidden sm:block p-1.5 transition-all ${shuffle ? 'text-accent' : 'text-white/40 hover:text-white'}`}
            >
              <FiShuffle size={16} />
            </button>

            <button onClick={playPrev} className="p-1.5 text-white/70 hover:text-white transition-all">
              <FiSkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow hover:opacity-90 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <FiPause size={18} className="text-white" />
              ) : (
                <FiPlay size={18} className="text-white ml-0.5" />
              )}
            </button>

            <button onClick={playNext} className="p-1.5 text-white/70 hover:text-white transition-all">
              <FiSkipForward size={20} />
            </button>

            <button
              onClick={cycleRepeat}
              className={`hidden sm:block p-1.5 transition-all ${repeat !== 'none' ? 'text-accent' : 'text-white/40 hover:text-white'}`}
            >
              {repeat === 'one' ? <MdRepeatOne size={16} /> : <FiRepeat size={16} />}
            </button>
          </div>

          {/* Volume + Favorite */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button onClick={handleFavorite} className={`p-1.5 transition-all ${isFavorite ? 'text-red-400' : 'text-white/40 hover:text-white'}`}>
              <FiHeart size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>

            <div className="flex items-center gap-2">
              <button onClick={handleMuteToggle} className="text-white/40 hover:text-white transition-all">
                {muted || volume === 0 ? <FiVolumex size={16} /> : <FiVolume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>

            <span className="text-xs text-white/30 w-20 text-right">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
