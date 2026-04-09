import { Link } from 'react-router-dom';
import { FiHome, FiMusic } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiMusic size={40} className="text-accent/60" />
        </div>
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Looks like this track doesn't exist. Let's get you back to the music.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
