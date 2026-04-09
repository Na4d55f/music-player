import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          The page you're looking for doesn't exist. Maybe the music took a wrong turn?
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Go Home
          </Link>
          <Link to="/browse" className="btn-secondary">Browse Music</Link>
        </div>
      </div>
    </div>
  );
}
