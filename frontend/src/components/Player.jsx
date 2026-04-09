import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player() {
  const {
    currentSong,
    isPlaying,
    isLoading,
    progress,
    duration,
    volume,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleFavorite,
    isFavorite,
  } = useMusic();

  const [showVolume, setShowVolume] = useState(false);

  if (!currentSong) return null;

  const isFav = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    seek(ratio * duration);
  };

  const handleProgressInput = (e) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-white/10"
      style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(24px)' }}
    >
      {/* Progress bar (thin, top) */}
      <div className="relative h-1 group cursor-pointer" onClick={handleSeek}>
        <div className="absolute inset-0 bg-white/10" />
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleProgressInput}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
          style={{ margin: 0 }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Song info */}
        <div className="flex items-center gap-3 min-w-0 w-1/3">
          <div className="relative shrink-0">
            <img
              src={currentSong.album_image || currentSong.image || `https://picsum.photos/seed/${currentSong.id}/48/48`}
              alt={currentSong.name}
              className={`w-12 h-12 rounded-lg object-cover shadow-lg ${isPlaying ? 'ring-2 ring-purple-500' : ''}`}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${currentSong.id}/48/48`; }}
            />
            {isPlaying && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse-slow" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentSong.name}</p>
            <p className="text-xs text-white/50 truncate">{currentSong.artist_name}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentSong)}
            className={`shrink-0 transition-colors ${isFav ? 'text-red-400' : 'text-white/30 hover:text-red-400'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-4">
            {/* Prev */}
            <button
              onClick={prevSong}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={isPlaying ? pauseSong : resumeSong}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextSong}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </button>
          </div>

          {/* Time display */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{formatTime(progress)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 justify-end w-1/3">
          <button
            onClick={() => setShowVolume((v) => !v)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <div className={`transition-all overflow-hidden ${showVolume ? 'w-24' : 'w-0'}`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-24 h-1 accent-purple-600"
              style={{
                background: `linear-gradient(to right, #7c3aed ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
