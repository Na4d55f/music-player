const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || 'b6747d04';
const JAMENDO_BASE = 'https://api.jamendo.com/v3.0';

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Proxy: get tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const { search, tags, order = 'popularity_total', limit = 20, offset = 0 } = req.query;
    const params = {
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit,
      offset,
      order,
      imagesize: 200,
      audioformat: 'mp32',
    };
    if (search) params.search = search;
    if (tags) params.tags = tags;

    const response = await axios.get(`${JAMENDO_BASE}/tracks/`, { params });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: get a single track
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const response = await axios.get(`${JAMENDO_BASE}/tracks/`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        id: req.params.id,
        audioformat: 'mp32',
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
