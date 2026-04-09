import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Player from './components/Player';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Search from './pages/Search';
import Browse from './pages/Browse';
import Playlists from './pages/Playlists';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import { useMusic } from './context/MusicContext';

const App = () => {
  const { currentSong } = useMusic();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* Main content with top padding for navbar */}
      <main className={`pt-16 ${currentSong ? 'pb-24' : ''}`}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Music Player */}
      <Player />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
