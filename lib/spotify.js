import { until } from "@open-draft/until";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export async function spotifySearch(query, token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=album,artist,track,show,audiobook&limit=10`,
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

export async function refreshToken(token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=album,artist,track,show,audiobook&limit=10`,
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
