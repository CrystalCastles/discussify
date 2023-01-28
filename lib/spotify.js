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

export async function getNewReleases(token) {
  const { error, data } = await until(() =>
    fetch(
      `${SPOTIFY_API_URL}/browse/new-releases?limit=10`,
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

// export async function getRefreshedToken(token) {
//   const { error, data } = await until(() =>
//     fetch(
//       `https://accounts.spotify.com/api/token`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': 'Basic ' + (Buffer.from('f3c7bdc5fb894fd7ad33a5ec20565cdd' + ':' + '7cfc65b47cd04bd78f59ef63b315494f').toString('base64')),
//         },
//         form: {
//           grant_type: 'refresh_token',
//           refresh_token: 'w9-CArNfiJpJnmrs0V0H1Q'
//         },
//         json: true
//       }
//     )
//   );
//   console.log(error, data)
//   if (error != null) {
//     return error;
//   }

//   return data.json();
// }