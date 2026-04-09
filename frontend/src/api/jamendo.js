import axios from 'axios';

// Jamendo API client ID is read from the environment variable set in .env
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || '';
export const JAMENDO_BASE = 'https://api.jamendo.com/v3.0';

/**
 * Fetch tracks from Jamendo with the given query params.
 * @param {Record<string,string|number>} params
 * @returns {Promise<Array>}
 */
export async function fetchTracks(params = {}) {
  const res = await axios.get(`${JAMENDO_BASE}/tracks/`, {
    params: {
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: 20,
      imagesize: 200,
      audioformat: 'mp32',
      ...params,
    },
  });
  return res.data.results || [];
}
