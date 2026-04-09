import { useNavigate } from 'react-router-dom';

const formatFollowers = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count?.toString() || '0';
};

export default function ArtistCard({ artist }) {
  const navigate = useNavigate();

  return (
    <div
      className="card group text-center cursor-pointer"
      onClick={() => navigate(`/search?q=${encodeURIComponent(artist.name)}`)}
    >
      <div className="relative mb-3 mx-auto w-24 h-24">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover rounded-full ring-2 ring-white/10 group-hover:ring-primary/50 transition-all"
          onError={e => { e.target.src = 'https://picsum.photos/seed/defaultArtist/96/96'; }}
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
      </div>
      <h3 className="font-semibold text-white text-sm truncate">{artist.name}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{artist.genre}</p>
      <p className="text-xs text-slate-600 mt-1">{formatFollowers(artist.followers)} followers</p>
    </div>
  );
}
