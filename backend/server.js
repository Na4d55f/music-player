const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const songs = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", genre: "Pop", duration: "3:20", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverUrl: "https://picsum.photos/seed/song1/300/300", plays: 98000000 },
  { id: 2, title: "Shape of You", artist: "Ed Sheeran", album: "Divide", genre: "Pop", duration: "3:53", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverUrl: "https://picsum.photos/seed/song2/300/300", plays: 87000000 },
  { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", genre: "Pop", duration: "3:23", year: 2020, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverUrl: "https://picsum.photos/seed/song3/300/300", plays: 76000000 },
  { id: 4, title: "Stay", artist: "The Kid LAROI and Justin Bieber", album: "F*CK LOVE 3", genre: "Pop", duration: "2:21", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverUrl: "https://picsum.photos/seed/song4/300/300", plays: 65000000 },
  { id: 5, title: "Drivers License", artist: "Olivia Rodrigo", album: "SOUR", genre: "Pop", duration: "4:02", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverUrl: "https://picsum.photos/seed/song5/300/300", plays: 60000000 },
  { id: 6, title: "Butter", artist: "BTS", album: "Butter", genre: "K-Pop", duration: "2:44", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", coverUrl: "https://picsum.photos/seed/song6/300/300", plays: 55000000 },
  { id: 7, title: "Peaches", artist: "Justin Bieber", album: "Justice", genre: "R&B", duration: "3:18", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", coverUrl: "https://picsum.photos/seed/song7/300/300", plays: 50000000 },
  { id: 8, title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", genre: "Alternative", duration: "3:14", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", coverUrl: "https://picsum.photos/seed/song8/300/300", plays: 48000000 },
  { id: 9, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", genre: "Pop Rock", duration: "2:54", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", coverUrl: "https://picsum.photos/seed/song9/300/300", plays: 45000000 },
  { id: 10, title: "Dynamite", artist: "BTS", album: "Dynamite", genre: "K-Pop", duration: "3:19", year: 2020, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverUrl: "https://picsum.photos/seed/song10/300/300", plays: 44000000 },
  { id: 11, title: "Mood", artist: "24kGoldn ft. iann dior", album: "El Dorado", genre: "Hip-Hop", duration: "2:21", year: 2020, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", coverUrl: "https://picsum.photos/seed/song11/300/300", plays: 42000000 },
  { id: 12, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", genre: "Pop Punk", duration: "2:58", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", coverUrl: "https://picsum.photos/seed/song12/300/300", plays: 41000000 },
  { id: 13, title: "Montero", artist: "Lil Nas X", album: "MONTERO", genre: "Pop", duration: "2:17", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", coverUrl: "https://picsum.photos/seed/song13/300/300", plays: 40000000 },
  { id: 14, title: "Permission to Dance", artist: "BTS", album: "Butter", genre: "K-Pop", duration: "3:05", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", coverUrl: "https://picsum.photos/seed/song14/300/300", plays: 39000000 },
  { id: 15, title: "Kiss Me More", artist: "Doja Cat ft. SZA", album: "Planet Her", genre: "R&B", duration: "3:32", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", coverUrl: "https://picsum.photos/seed/song15/300/300", plays: 38000000 },
  { id: 16, title: "Leave The Door Open", artist: "Silk Sonic", album: "An Evening with Silk Sonic", genre: "R&B", duration: "4:02", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverUrl: "https://picsum.photos/seed/song16/300/300", plays: 37000000 },
  { id: 17, title: "Happier Than Ever", artist: "Billie Eilish", album: "Happier Than Ever", genre: "Alternative", duration: "4:58", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverUrl: "https://picsum.photos/seed/song17/300/300", plays: 36000000 },
  { id: 18, title: "Industry Baby", artist: "Lil Nas X and Jack Harlow", album: "MONTERO", genre: "Hip-Hop", duration: "3:32", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverUrl: "https://picsum.photos/seed/song18/300/300", plays: 35000000 },
  { id: 19, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", genre: "Pop", duration: "3:35", year: 2020, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverUrl: "https://picsum.photos/seed/song19/300/300", plays: 34000000 },
  { id: 20, title: "Astronaut in the Ocean", artist: "Masked Wolf", album: "Astronaut in the Ocean", genre: "Hip-Hop", duration: "2:22", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverUrl: "https://picsum.photos/seed/song20/300/300", plays: 33000000 },
  { id: 21, title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", genre: "Bollywood", duration: "4:22", year: 2013, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverUrl: "https://picsum.photos/seed/song21/300/300", plays: 80000000 },
  { id: 22, title: "Kesariya", artist: "Arijit Singh", album: "Brahmastra", genre: "Bollywood", duration: "4:28", year: 2022, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", coverUrl: "https://picsum.photos/seed/song22/300/300", plays: 75000000 },
  { id: 23, title: "Raataan Lambiyaan", artist: "Jubin Nautiyal", album: "Shershaah", genre: "Bollywood", duration: "3:36", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", coverUrl: "https://picsum.photos/seed/song23/300/300", plays: 70000000 },
  { id: 24, title: "Tera Ban Jaunga", artist: "Akhil and Tulsi Kumar", album: "Kabir Singh", genre: "Bollywood", duration: "3:42", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", coverUrl: "https://picsum.photos/seed/song24/300/300", plays: 65000000 },
  { id: 25, title: "Filhaal", artist: "Akshay Kumar ft. Nupur Sanon", album: "Filhaal", genre: "Bollywood", duration: "4:02", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", coverUrl: "https://picsum.photos/seed/song25/300/300", plays: 60000000 },
  { id: 26, title: "Kal Ho Naa Ho", artist: "Sonu Nigam", album: "Kal Ho Naa Ho", genre: "Bollywood", duration: "5:27", year: 2003, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverUrl: "https://picsum.photos/seed/song26/300/300", plays: 55000000 },
  { id: 27, title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", album: "Dil Se", genre: "Bollywood", duration: "7:30", year: 1998, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", coverUrl: "https://picsum.photos/seed/song27/300/300", plays: 50000000 },
  { id: 28, title: "Jai Ho", artist: "A.R. Rahman", album: "Slumdog Millionaire", genre: "Bollywood", duration: "5:01", year: 2008, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", coverUrl: "https://picsum.photos/seed/song28/300/300", plays: 48000000 },
  { id: 29, title: "Ik Vaari Aa", artist: "Arijit Singh", album: "Raabta", genre: "Bollywood", duration: "4:41", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", coverUrl: "https://picsum.photos/seed/song29/300/300", plays: 45000000 },
  { id: 30, title: "Tera Yaar Hoon Main", artist: "Arijit Singh", album: "Sonu Ke Titu Ki Sweety", genre: "Bollywood", duration: "4:10", year: 2018, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", coverUrl: "https://picsum.photos/seed/song30/300/300", plays: 43000000 },
  { id: 31, title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", genre: "Rock", duration: "5:55", year: 1975, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", coverUrl: "https://picsum.photos/seed/song31/300/300", plays: 88000000 },
  { id: 32, title: "Hotel California", artist: "Eagles", album: "Hotel California", genre: "Rock", duration: "6:30", year: 1977, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverUrl: "https://picsum.photos/seed/song32/300/300", plays: 72000000 },
  { id: 33, title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", genre: "Rock", duration: "5:01", year: 1991, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverUrl: "https://picsum.photos/seed/song33/300/300", plays: 64000000 },
  { id: 34, title: "Sweet Child O Mine", artist: "Guns N Roses", album: "Appetite for Destruction", genre: "Rock", duration: "5:55", year: 1987, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverUrl: "https://picsum.photos/seed/song34/300/300", plays: 60000000 },
  { id: 35, title: "God's Plan", artist: "Drake", album: "Scorpion", genre: "Hip-Hop", duration: "3:19", year: 2018, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverUrl: "https://picsum.photos/seed/song35/300/300", plays: 58000000 },
  { id: 36, title: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", genre: "Hip-Hop", duration: "2:57", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverUrl: "https://picsum.photos/seed/song36/300/300", plays: 55000000 },
  { id: 37, title: "Rockstar", artist: "Post Malone ft. 21 Savage", album: "Beerbongs and Bentleys", genre: "Hip-Hop", duration: "3:39", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverUrl: "https://picsum.photos/seed/song37/300/300", plays: 52000000 },
  { id: 38, title: "Rolling in the Deep", artist: "Adele", album: "21", genre: "Soul", duration: "3:48", year: 2010, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", coverUrl: "https://picsum.photos/seed/song38/300/300", plays: 72000000 },
  { id: 39, title: "Someone Like You", artist: "Adele", album: "21", genre: "Soul", duration: "4:45", year: 2011, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", coverUrl: "https://picsum.photos/seed/song39/300/300", plays: 68000000 },
  { id: 40, title: "Hello", artist: "Adele", album: "25", genre: "Soul", duration: "4:55", year: 2015, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", coverUrl: "https://picsum.photos/seed/song40/300/300", plays: 65000000 },
  { id: 41, title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "Vida", genre: "Latin", duration: "3:47", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", coverUrl: "https://picsum.photos/seed/song41/300/300", plays: 80000000 },
  { id: 42, title: "Perfect", artist: "Ed Sheeran", album: "Divide", genre: "Pop", duration: "4:23", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverUrl: "https://picsum.photos/seed/song42/300/300", plays: 58000000 },
  { id: 43, title: "Thinking Out Loud", artist: "Ed Sheeran", album: "X", genre: "Pop", duration: "4:41", year: 2014, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", coverUrl: "https://picsum.photos/seed/song43/300/300", plays: 52000000 },
  { id: 44, title: "Senorita", artist: "Shawn Mendes and Camila Cabello", album: "Senorita", genre: "Pop", duration: "3:10", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", coverUrl: "https://picsum.photos/seed/song44/300/300", plays: 50000000 },
  { id: 45, title: "Havana", artist: "Camila Cabello", album: "Camila", genre: "Pop", duration: "3:36", year: 2017, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", coverUrl: "https://picsum.photos/seed/song45/300/300", plays: 47000000 },
  { id: 46, title: "Srivalli", artist: "Sid Sriram", album: "Pushpa", genre: "Telugu", duration: "3:23", year: 2021, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", coverUrl: "https://picsum.photos/seed/song46/300/300", plays: 60000000 },
  { id: 47, title: "Naatu Naatu", artist: "Rahul Sipligunj and Kaala Bhairava", album: "RRR", genre: "Telugu", duration: "4:35", year: 2022, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", coverUrl: "https://picsum.photos/seed/song47/300/300", plays: 55000000 },
  { id: 48, title: "Ikk Kudi", artist: "Diljit Dosanjh", album: "Udta Punjab", genre: "Punjabi", duration: "3:42", year: 2016, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverUrl: "https://picsum.photos/seed/song48/300/300", plays: 50000000 },
  { id: 49, title: "Ghungroo", artist: "Arijit Singh and Shilpa Rao", album: "War", genre: "Bollywood", duration: "4:08", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverUrl: "https://picsum.photos/seed/song49/300/300", plays: 44000000 },
  { id: 50, title: "Old Town Road", artist: "Lil Nas X", album: "7 EP", genre: "Hip-Hop", duration: "1:53", year: 2019, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverUrl: "https://picsum.photos/seed/song50/300/300", plays: 48000000 },
  { id: 51, title: "Waterloo", artist: "ABBA", album: "Waterloo", genre: "Pop", duration: "2:45", year: 1974, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverUrl: "https://picsum.photos/seed/song51/300/300", plays: 40000000 },
  { id: 52, title: "Dancing Queen", artist: "ABBA", album: "Arrival", genre: "Pop", duration: "3:51", year: 1976, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverUrl: "https://picsum.photos/seed/song52/300/300", plays: 42000000 },
  { id: 53, title: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", genre: "Rock", duration: "4:05", year: 1982, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverUrl: "https://picsum.photos/seed/song53/300/300", plays: 38000000 },
  { id: 54, title: "Take On Me", artist: "a-ha", album: "Hunting High and Low", genre: "Pop", duration: "3:48", year: 1985, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", coverUrl: "https://picsum.photos/seed/song54/300/300", plays: 36000000 },
  { id: 55, title: "Africa", artist: "Toto", album: "Toto IV", genre: "Pop Rock", duration: "4:55", year: 1982, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", coverUrl: "https://picsum.photos/seed/song55/300/300", plays: 34000000 },
];

const users = [];

app.get('/api/songs', (req, res) => {
  res.json({ success: true, data: songs, total: songs.length });
});

app.get('/api/songs/trending', (req, res) => {
  const trending = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 20);
  res.json({ success: true, data: trending });
});

app.get('/api/songs/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: songs });
  const query = q.toLowerCase();
  const results = songs.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.artist.toLowerCase().includes(query) ||
    s.album.toLowerCase().includes(query) ||
    s.genre.toLowerCase().includes(query)
  );
  res.json({ success: true, data: results });
});

app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
  res.json({ success: true, data: song });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const user = { id: users.length + 1, name, email, passwordHash: hashPassword(password) };
  users.push(user);
  res.json({ success: true, data: { id: user.id, name: user.name, email: user.email }, message: 'Registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const hash = hashPassword(password);
  const user = users.find(u => u.email === email && u.passwordHash === hash);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({ success: true, data: { id: user.id, name: user.name, email: user.email }, message: 'Login successful' });
});

app.get('/api/genres', (req, res) => {
  const genres = [...new Set(songs.map(s => s.genre))];
  res.json({ success: true, data: genres });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
