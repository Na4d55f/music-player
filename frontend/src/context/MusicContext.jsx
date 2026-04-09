import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [playlists, setPlaylists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playlists') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const addToRecent = useCallback((song) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 20);
    });
  }, []);

  const playSong = useCallback(
    (song, newQueue = null) => {
      if (newQueue) {
        setQueue(newQueue);
        const idx = newQueue.findIndex((s) => s.id === song.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      }
      setCurrentSong(song);
      setIsLoading(true);
      setProgress(0);
      addToRecent(song);

      const audio = audioRef.current;
      if (audio) {
        audio.src = song.audio;
        audio.load();
        audio.play().catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    },
    [addToRecent]
  );

  const pauseSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  }, []);

  const resumeSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      audio.play().catch((err) => {
        console.warn('Resume error:', err);
      });
    }
  }, [currentSong]);

  const nextSong = useCallback(() => {
    if (!queue.length) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  }, [queue, queueIndex, playSong]);

  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (!queue.length) return;
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  }, [queue, queueIndex, playSong]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setProgress(time);
    }
  }, []);

  const toggleFavorite = useCallback((song) => {
    setFavorites((prev) => {
      const exists = prev.some((s) => s.id === song.id);
      if (exists) return prev.filter((s) => s.id !== song.id);
      return [song, ...prev];
    });
  }, []);

  const isFavorite = useCallback(
    (songId) => favorites.some((s) => s.id === songId),
    [favorites]
  );

  const createPlaylist = useCallback((name, emoji = '🎵') => {
    const playlist = {
      id: Date.now().toString(),
      name,
      emoji,
      songs: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists((prev) => [...prev, playlist]);
    return playlist;
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }, []);

  const addSongToPlaylist = useCallback((playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.songs.some((s) => s.id === song.id)) return p;
        return { ...p, songs: [...p.songs, song] };
      })
    );
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        return { ...p, songs: p.songs.filter((s) => s.id !== songId) };
      })
    );
  }, []);

  // Audio event handlers
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setProgress(audio.currentTime);
  };

  const handleDurationChange = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => setIsPlaying(false);

  const handleEnded = () => {
    nextSong();
  };

  const handleWaiting = () => setIsLoading(true);

  const handleCanPlay = () => setIsLoading(false);

  const handleError = () => {
    console.error('Audio error on:', currentSong?.audio);
    setIsPlaying(false);
    setIsLoading(false);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        volume,
        progress,
        duration,
        isLoading,
        recentlyPlayed,
        favorites,
        playlists,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        prevSong,
        seek,
        setVolume,
        toggleFavorite,
        isFavorite,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onError={handleError}
        preload="metadata"
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
}
