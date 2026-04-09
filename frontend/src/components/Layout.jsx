import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';
import { useMusic } from '../context/MusicContext';

export default function Layout({ children }) {
  const { currentSong } = useMusic();

  return (
    <div className="min-h-screen bg-[#0F0F1A]" style={{ paddingBottom: currentSong ? '100px' : '0' }}>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      {currentSong && <MusicPlayer />}
    </div>
  );
}
