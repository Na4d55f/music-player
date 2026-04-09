import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

const formatNumber = (n) => {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const ArtistCard = ({ artist }) => {
  return (
    <Link
      to={`/browse?artist=${encodeURIComponent(artist.name)}`}
      className="glass-card-hover rounded-xl p-4 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-glow-purple"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-accent/50 transition-all">
        {artist.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
            <FiUser size={28} className="text-white/30" />
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-white text-sm truncate w-full">{artist.name}</h3>

      {/* Listeners */}
      {artist.listeners && (
        <p className="text-white/40 text-xs mt-0.5">
          {formatNumber(artist.listeners)} listeners
        </p>
      )}

      {/* Tags */}
      {artist.tags && artist.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {artist.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-primary/20 text-primary-light px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default ArtistCard;
