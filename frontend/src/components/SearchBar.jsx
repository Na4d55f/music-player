import { useState, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = 'Search songs, artists, albums...', autoFocus = false, fullWidth = false }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (onSearch) {
      onSearch(q);
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${fullWidth ? 'w-full' : 'max-w-xl'}`}>
      <div className="relative flex items-center">
        <FiSearch
          size={18}
          className="absolute left-4 text-white/40 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="input-field pl-12 pr-12"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-white/40 hover:text-white transition-colors"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
