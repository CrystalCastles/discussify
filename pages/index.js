import Head from "next/head";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";
import CategoryResults from "../components/CategoryResults";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import CuratedResults from "../components/CuratedResults";

export default function Home() {
  const inputRef = useRef();
  const supabase = useSupabaseClient();
  const session = useSession();
  const token = session?.provider_token;

  const [recentlyPlayed, setRecentlyPlayed] = useState();

  useEffect(() => {
    getRecentlyPlayed(token);
  }, [session])

  async function signInWithSpotify() {
    try {
      const { error, data } = await supabase.auth.signInWithOAuth(
        {
          provider: "spotify",
          options: {
            scopes: "user-read-recently-played",
          }
        },
      );
      if (error) {
        alert("Error with auth: " + error.message);
      }
    } catch {
      console.log("error", error);
      alert(error.error_description || error);
    }
  }

  async function getRecentlyPlayed(token) {
    fetch("/api/spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        recent: true
      })
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setRecentlyPlayed(data);
      } else {
        console.log("Error: please try again")
        setRecentlyPlayed(null);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main class="bg-mainBlack">
        {session ? (
          <div className="min-h-[calc(100vh-70px)] grid 2xl:grid-cols-3 gap-6 xs: mx-5 lg:mx-[16rem] 2xl:mx-16 overflow-hidden py-5">
            <div className="bg-spotifyBlack rounded-lg p-2">
              <h1 className="text-white text-center text-2xl font-semibold">Recently played</h1>
              { recentlyPlayed && <CuratedResults media={recentlyPlayed}/> }
            </div>
            <div className="bg-spotifyBlack rounded-lg p-2">
              <h1 className="text-white text-center text-2xl font-semibold ml-5">Recently active</h1>
              { recentlyPlayed && <CuratedResults media={recentlyPlayed}/> }
            </div>
            <div className="bg-spotifyBlack rounded-lg p-2">
              <h1 className="text-white text-center text-2xl font-semibold">Hot topics</h1>
              { recentlyPlayed && <CuratedResults media={recentlyPlayed}/> }
            </div>
          </div>
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-white">App Name</h1>
              <button
                className="text-s inline-block rounded-full bg-spotifyGreen px-8 py-3 font-medium leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg"
                onClick={signInWithSpotify}
              >
                Log In with Spotify
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}