import { getNewReleases, getRecentlyPlayed, getRefreshedToken, spotifySearch } from "../../lib/spotify";

export default async function handler(req, res) {
  if(req.method !== "POST") {
    return res.status(405).end();
  }
  
  const { token } = req.body;
  const { refreshToken } = req.body;
  const { query } = req.body;
  const { recent } = req.body;
  const { newReleases } = req.body;
  if((!token && (!query && !recent && !newReleases)) && !refreshToken) {
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
      if(searchResults.error.status === 401 || searchResults.error.message == 'The access token expired') {
        return res.status(401).send('The access token expired');
      }

      return res.status(400).end();
    }
    res.json(searchResults);
  } else if(newReleases) {
    const newReleases = await getNewReleases(token);
    if(!newReleases || newReleases.error) {
      return res.status(400).end();
    }
    res.json(newReleases);
  } else if(refreshToken) {
    const refreshed_token = await getRefreshedToken(refreshToken);
    if(!refreshed_token || refreshed_token.error) {
      return res.status(400).end();
    }

    res.json(refreshed_token);
  }

  res.end();
}