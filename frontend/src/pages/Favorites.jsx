import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';

export default function Favorites() {
  const { favorites } = useMusic();

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">❤️ Favorites</h1>
      <p className="text-gray-400 mb-8">{favorites.length} songs saved</p>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">❤️</p>
          <p className="text-gray-400 text-xl">No favorites yet</p>
          <p className="text-gray-600 mt-2">Click ❤️ on any song to save it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map(song => <SongCard key={song.id} song={song} />)}
        </div>
      )}
    </div>
  );
}
