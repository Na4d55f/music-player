import { FiPlay, FiPause, FiHeart, FiMoreVertical, FiMusic, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useMusic } from '../context/MusicContext';

const formatNumber = (n) => {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const SongCard = ({ song, songList, isFavorite, onFavoriteToggle, onAddToPlaylist, compact = false }) => {
  const { playSong, currentSong, isPlaying, togglePlay } = useMusic();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, songList || [song]);
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group cursor-pointer
          ${isCurrentSong ? 'bg-white/5' : ''}`}
        onClick={handlePlay}
      >
        <div className="relative flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
          {song.image ? (
            <img src={song.image} alt={song.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
              <FiMusic size={14} className="text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isCurrentSong && isPlaying ? (
              <FiPause size={14} className="text-white" />
            ) : (
              <FiPlay size={14} className="text-white ml-0.5" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-accent' : 'text-white'}`}>
            {song.name}
          </p>
          <p className="text-xs text-white/40 truncate">{song.artist}</p>
        </div>

        {song.playCount && (
          <span className="text-xs text-white/30">{formatNumber(song.playCount)}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`glass-card-hover rounded-xl p-4 cursor-pointer group relative transition-all duration-300
        ${isCurrentSong ? 'border-accent/30 bg-accent/5' : ''}`}
      onClick={handlePlay}
    >
      {/* Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
        {song.image ? (
          <img
            src={song.image}
            alt={song.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
            <FiMusic size={28} className="text-white/30" />
          </div>
        )}

        {/* Play button */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity
          ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
            {isCurrentSong && isPlaying ? (
              <FiPause size={20} className="text-white" />
            ) : (
              <FiPlay size={20} className="text-white ml-1" />
            )}
          </div>
        </div>

        {/* Playing indicator */}
        {isCurrentSong && isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="equalizer-bar"
                style={{ height: `${Math.random() * 60 + 40}%`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold text-sm truncate ${isCurrentSong ? 'text-accent' : 'text-white'}`}>
            {song.name}
          </h3>
          <p className="text-white/50 text-xs mt-0.5 truncate">{song.artist}</p>
          {song.listeners && (
            <p className="text-white/30 text-xs mt-0.5">{formatNumber(song.listeners)} listeners</p>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {onFavoriteToggle && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavoriteToggle(song); }}
              className={`p-1.5 transition-all opacity-0 group-hover:opacity-100 ${isFavorite ? 'text-red-400 opacity-100' : 'text-white/30 hover:text-white'}`}
            >
              <FiHeart size={14} className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}

          {onAddToPlaylist && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                className="p-1.5 text-white/30 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <FiPlus size={14} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                  <div className="absolute right-0 top-full mt-1 w-40 glass-card border border-white/10 rounded-lg shadow-glass z-20 overflow-hidden">
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <FiPlus size={14} /> Add to Playlist
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
