import { useMusic } from '../context/MusicContext';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const { currentSong, isPlaying, currentTime, duration, volume, togglePlay, playNext, playPrev, seek, changeVolume, toggleFavorite, isFavorite } = useMusic();

  if (!currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#070710]/95 backdrop-blur-md border-t border-purple-900/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 w-48 min-w-0">
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentSong)}
            className={`flex-shrink-0 text-lg transition-colors ${isFavorite(currentSong.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-400'}`}
          >
            ❤️
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button onClick={playPrev} className="text-gray-400 hover:text-white transition-colors text-xl">⏮</button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors text-lg"
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors text-xl">⏭</button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-lg">
            <span className="text-xs text-gray-400 w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              className="flex-1 h-1 accent-purple-500 cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 w-32">
          <span className="text-gray-400 text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => changeVolume(Number(e.target.value))}
            className="flex-1 h-1 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
