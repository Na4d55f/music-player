import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { addRecentlyPlayed } from '../services/userAPI';
import { useAuth } from './AuthContext';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // 'none' | 'one' | 'all'
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  });

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 500);
    } else {
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  const playSong = useCallback(
    async (song, songQueue = null) => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentSong(song);
      setProgress(0);
      setDuration(0);

      if (songQueue) {
        setQueue(songQueue);
        const idx = songQueue.findIndex((s) => s.id === song.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      }

      if (song.url) {
        setIsLoading(true);
        audio.src = song.url;
        audio.load();
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
          setIsLoading(false);
        }
      } else {
        // No URL — simulate playback for demo
        setIsPlaying(true);
        setDuration(song.duration || 210);
      }

      if (isAuthenticated && song) {
        addRecentlyPlayed({
          songId: song.id,
          songName: song.name,
          artist: song.artist,
          image: song.image,
        }).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (audio && audio.src) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    }
    setIsPlaying((p) => !p);
  }, [currentSong, isPlaying]);

  const playNext = useCallback(() => {
    if (!queue.length) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  }, [queue, queueIndex, shuffle, repeat, playSong]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }

    if (!queue.length) return;
    const prevIndex = queueIndex - 1 < 0 ? queue.length - 1 : queueIndex - 1;
    setQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  }, [queue, queueIndex, playSong]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.currentTime = time;
    }
    setProgress(time);
  }, []);

  const changeVolume = useCallback((vol) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'none' ? 'all' : r === 'all' ? 'one' : 'none'));
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue((q) => [...q, song]);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        queue,
        queueIndex,
        isPlaying,
        volume,
        progress,
        duration,
        shuffle,
        repeat,
        isLoading,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seek,
        changeVolume,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        setQueue,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};

export default MusicContext;
