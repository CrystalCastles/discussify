import { getNewReleases, getRecentlyPlayed, spotifySearch } from "../../lib/spotify";

export default async function handler(req, res) {
  if(req.method !== "POST") {
    return res.status(405).end();
  }
  
  const { token } = req.body;
  const { query } = req.body;
  const { recent } = req.body;
  const { newReleases } = req.body;

  if(!token || (!query && !recent && !newReleases)) {
    return res.status(400).end();
  }

  if(recent) {
    const recentlyPlayed = await getRecentlyPlayed(token);

    if(!recentlyPlayed || recentlyPlayed.error) {
      if(recentlyPlayed.error.status === 401 || recentlyPlayed.error.message == 'The access token expired') {
        return res.status(401).send('The access token expired');
      }

      return res.status(400).end();
    }

    res.json(recentlyPlayed);
  } else if(query) {
    const searchResults = await spotifySearch(query, token);

    if(!searchResults || searchResults.error) {
      return res.status(400).end();
    }

    res.json(searchResults);
  } else if(newReleases) {
    const newReleases = await getNewReleases(token);

    if(!newReleases || newReleases.error) {
      return res.status(400).end();
    }
    res.json(newReleases);
  }

  res.end();
}