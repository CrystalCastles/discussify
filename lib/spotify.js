import { until } from "@open-draft/until";
const { URLSearchParams } = require('url');

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export async function spotifySearch(query, token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=album,artist,track,show,audiobook,playlist&limit=15`,
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
      `${SPOTIFY_API_URL}/me/player/recently-played?limit=12&before=${date}`,
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

export async function getNewReleases(token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/browse/new-releases?limit=12`,
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
  } else {
    return data.json();
  }
}

export async function getRefreshedToken(refreshToken) {
  const paramData = new URLSearchParams();
  paramData.append("grant_type", "refresh_token");
  paramData.append("refresh_token", refreshToken);

  const { error, data } = await until(() =>
    fetch(
      `https://accounts.spotify.com/api/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        },
        body: paramData
      }
    )
  );
  console.log(error)
  if (error != null) {
    return error;
  }
  console.log(data)
  return data.json();
}