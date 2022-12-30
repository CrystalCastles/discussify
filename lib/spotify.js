const SPOTIFY_API_URL = "https://api.spotify.com/v1/";

export async function spotifySearch(query, token) {
  const { error, data: response } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=album,artist,playlist,show,episode,audiobook`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
  );

  if (error != null) {
    return error;
  }

  const { data } = (await response.json());

  return data;
}
