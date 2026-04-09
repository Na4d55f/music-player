import { useMusic } from '../context/MusicContext.jsx';

const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatPlays = (plays) => {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
  return plays?.toString() || '0';
};

export default function SongCard({ song, songs, compact = false, showIndex = null }) {
  const { playSong, togglePlay, isPlaying, currentSong, toggleFavorite, isFavorite } = useMusic();

  const isCurrentSong = currentSong?.id === song.id;
  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, songs || [song]);
    }
  };

  if (compact) {
    return (
      <div className={`song-row ${isCurrentSong ? 'bg-primary/10 border border-primary/20' : ''}`} onClick={handlePlay}>
        {showIndex !== null ? (
          <div className="w-6 text-center flex-shrink-0">
            {isCurrentSong && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4 justify-center">
                <div className="w-0.5 bg-primary rounded-t eq-bar" style={{height: '60%'}} />
                <div className="w-0.5 bg-primary rounded-t eq-bar" style={{height: '100%'}} />
                <div className="w-0.5 bg-primary rounded-t eq-bar" style={{height: '70%'}} />
              </div>
            ) : (
              <span className={`text-xs ${isCurrentSong ? 'text-primary' : 'text-slate-600'} group-hover:hidden`}>{showIndex + 1}</span>
            )}
          </div>
        ) : null}
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          onError={e => { e.target.src = 'https://picsum.photos/seed/default/40/40'; }}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-primary' : 'text-white'}`}>{song.title}</p>
          <p className="text-xs text-slate-500 truncate">{song.artist}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
            className={`p-1 rounded-lg transition-colors ${isFavorite(song.id) ? 'text-pink-500' : 'text-slate-700 hover:text-pink-400'}`}
          >
            <svg className="w-4 h-4" fill={isFavorite(song.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <span className="text-xs text-slate-600 tabular-nums">{formatDuration(song.duration)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card group relative overflow-hidden ${isCurrentSong ? 'ring-2 ring-primary/50 bg-primary/10' : ''}`}
      onClick={handlePlay}
    >
      <div className="relative mb-3">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-xl"
          onError={e => { e.target.src = 'https://picsum.photos/seed/default/300/300'; }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            {isCurrentSong && isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>
        {isCurrentSong && isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5 h-4">
            <div className="w-1 bg-primary rounded-t eq-bar" style={{height: '60%'}} />
            <div className="w-1 bg-primary rounded-t eq-bar" style={{height: '100%'}} />
            <div className="w-1 bg-primary rounded-t eq-bar" style={{height: '70%'}} />
            <div className="w-1 bg-primary rounded-t eq-bar" style={{height: '80%'}} />
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`font-semibold truncate text-sm ${isCurrentSong ? 'text-primary' : 'text-white'}`}>{song.title}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{song.artist}</p>
          <p className="text-xs text-slate-600 mt-1">{formatPlays(song.plays)} plays</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isFavorite(song.id) ? 'text-pink-500' : 'text-slate-700 hover:text-pink-400'}`}
        >
          <svg className="w-4 h-4" fill={isFavorite(song.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
