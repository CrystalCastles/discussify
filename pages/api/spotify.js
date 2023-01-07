import { getRecentlyPlayed, spotifySearch } from "../../lib/spotify";

export default async function handler(req, res) {
  if(req.method !== "POST") {
    return res.status(405).end();
  }
  
  const { token } = req.body;
  const { query } = req.body;
  const { recent } = req.body;

  if(!token || (!query && !recent)) {
    return res.status(400).end();
  }

  if(recent) {
    const recentlyPlayed = await getRecentlyPlayed(token);
    console.log("recently played " + recentlyPlayed)
    if(!recentlyPlayed || recentlyPlayed.error) {
      return res.status(400).end();
    }

    res.json(recentlyPlayed);
  } else if(query) {
    const searchResults = await spotifySearch(query, token);

    if(!searchResults || searchResults.error) {
      return res.status(400).end();
    }

    res.json(searchResults);
  }

  res.end();
}