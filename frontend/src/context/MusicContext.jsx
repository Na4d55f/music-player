import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { userAPI } from '../services/userAPI.js';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const stored = localStorage.getItem('volume');
    return stored ? parseFloat(stored) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'one' | 'all'
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch { return []; }
  });
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);

  const currentSong = queue[currentIndex] || null;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('durationchange', () => setDuration(audio.duration || 0));
    audio.addEventListener('ended', () => handleSongEnd());
    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('error', () => setIsLoading(false));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []); // eslint-disable-line

  const handleSongEnd = useCallback(() => {
    setIsPlaying(false);
    const audio = audioRef.current;
    if (!audio) return;

    if (repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setCurrentIndex(prev => {
        const nextIdx = prev + 1;
        if (nextIdx < queue.length) {
          return nextIdx;
        } else if (repeatMode === 'all') {
          return 0;
        }
        return prev;
      });
    }
  }, [repeatMode, queue.length]);

  // When currentIndex or queue changes, load the new song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    const wasPlaying = isPlaying;
    audio.src = currentSong.audioUrl;
    audio.load();
    if (wasPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    // Record recently played
    userAPI.recordRecentlyPlayed(currentSong.id).catch(() => {});
  }, [currentIndex, currentSong?.id]); // eslint-disable-line

  const playSong = useCallback((song, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === song.id);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      // Check if song is already in queue
      const existingIdx = queue.findIndex(s => s.id === song.id);
      if (existingIdx >= 0) {
        setCurrentIndex(existingIdx);
      } else {
        setQueue(prev => [...prev, song]);
        setCurrentIndex(queue.length);
      }
    }

    const audio = audioRef.current;
    if (!audio) return;
    audio.src = song.audioUrl;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    userAPI.recordRecentlyPlayed(song.id).catch(() => {});
  }, [queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (isShuffled) {
        const nextIdx = Math.floor(Math.random() * queue.length);
        return nextIdx;
      }
      const next = prev + 1;
      return next < queue.length ? next : (repeatMode === 'all' ? 0 : prev);
    });
    setIsPlaying(true);
  }, [queue.length, isShuffled, repeatMode]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    setIsPlaying(true);
  }, [currentTime]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol) => {
    const audio = audioRef.current;
    setVolumeState(vol);
    if (audio) audio.volume = vol;
    localStorage.setItem('volume', vol.toString());
    if (vol > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.volume = newMuted ? 0 : volume;
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => setIsShuffled(prev => !prev), []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const toggleFavorite = useCallback((songId) => {
    setFavorites(prev => {
      const newFavs = prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId];
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      // Sync with server
      userAPI.toggleFavorite(songId).catch(() => {});
      return newFavs;
    });
  }, []);

  const isFavorite = useCallback((songId) => favorites.includes(songId), [favorites]);

  const value = {
    queue,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    favorites,
    isLoading,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    addToQueue,
    toggleFavorite,
    isFavorite,
    setQueue,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
};

export default MusicContext;
