import { useMusic } from '../context/MusicContext.jsx';

export default function PlaylistCard({ playlist, onDelete, onPlay }) {
  const { playSong } = useMusic();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay(playlist);
    else if (playlist.songData?.length > 0) {
      playSong(playlist.songData[0], playlist.songData);
    }
  };

  return (
    <div className="card group relative">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt={playlist.name} className="w-14 h-14 rounded-xl object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/40 to-cyan-600/40 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}
          <button
            onClick={handlePlay}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{playlist.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{playlist.description || 'No description'}</p>
          <p className="text-xs text-slate-600 mt-1">{playlist.songs?.length || 0} songs</p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(playlist.id || playlist._id); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-white/10 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
