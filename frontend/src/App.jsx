import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Layout>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
