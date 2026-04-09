import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { MusicProvider } from './context/MusicContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Favorites from './pages/Favorites.jsx';
import Playlists from './pages/Playlists.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex pt-16 pb-24">
        <Sidebar />
        <main className="flex-1 lg:ml-56 px-4 lg:px-8 py-6 max-w-full overflow-x-hidden">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <MusicPlayer />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <Router>
      <UIProvider>
        <AuthProvider>
          <MusicProvider>
            <Routes>
              <Route path="/login" element={
                <div className="min-h-screen bg-dark px-4 py-8">
                  <div className="max-w-screen-xl mx-auto">
                    <Login />
                  </div>
                  <Toast />
                </div>
              } />
              <Route path="/register" element={
                <div className="min-h-screen bg-dark px-4 py-8">
                  <div className="max-w-screen-xl mx-auto">
                    <Register />
                  </div>
                  <Toast />
                </div>
              } />
              <Route path="/" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
              <Route path="/browse" element={<AppLayout><Browse /></AppLayout>} />
              <Route path="/favorites" element={<AppLayout><Favorites /></AppLayout>} />
              <Route path="/playlists" element={<AppLayout><Playlists /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
          </MusicProvider>
        </AuthProvider>
      </UIProvider>
    </Router>
  );
}

export default App;
