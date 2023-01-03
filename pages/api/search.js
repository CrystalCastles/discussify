import { spotifySearch } from "../../lib/spotify";

export default async function handler(req, res) {
  if(req.method !== "POST") {
    return res.status(405).end();
  }
  
  const { token } = req.body;
  const { query } = req.body;

  if(!token || !query) {
    return res.status(400).end();
  }

  const searchResults = await spotifySearch(query, token);

  if(!searchResults || searchResults.error) {
    return res.status(400).end();
  }

  res.json(searchResults);
}