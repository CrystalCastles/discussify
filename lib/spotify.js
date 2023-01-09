import { until } from "@open-draft/until";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export async function spotifySearch(query, token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=album,artist,track,show,audiobook,playlist&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
  
  if (error != null) {
    return error;
  }

  return data.json();
}

export async function getRecentlyPlayed(token) {
  const date = Date.now();
  
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/me/player/recently-played?limit=10&before=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
  
  if (error != null) {
    return error;
  }

  return data.json();
}

export async function getMediaById(token, category, id) {
  
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/${category}s/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
  
  if (error != null) {
    return error;
  }

  return data.json();
}