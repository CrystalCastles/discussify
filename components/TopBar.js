import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRef, useState } from "react";
import CategoryResults from "../components/CategoryResults";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import nookies from 'nookies';
import { parseCookies } from 'nookies';

export default function TopBar() {
  const inputRef = useRef();
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user_name = session?.user?.user_metadata?.name;
  const user_image = session?.user?.user_metadata?.avatar_url;
  const cookies = parseCookies();

  const [searchResults, setSearchResults] = useState();
  const [searchValue, setSearchValue] = useState();
  const [resultsHidden, setResultsHidden] = useState(true);
  const [userOptionsDisplayed, setUserOptionsDisplayed] = useState(false);

  function searchSpotify(e) {
    e.preventDefault();
    if (!inputRef.current.value || inputRef.current.value == searchValue) {
      return;
    }

    setSearchValue(inputRef.current.value);
    setResultsHidden(false);

    fetch("/api/spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: inputRef.current.value,
        token: cookies['__spotifyToken'],
      }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        if(response.status === 401) {
          return fetch("/api/spotify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refreshToken: cookies['__spotifyRefreshToken'],
            })
          }).then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              nookies.set(null, '__spotifyToken', data.access_token);
              return searchSpotify(data.access_token);
            } else {
              console.log("Error refreshing token.")
            }
          });
        } else {
          setSearchResults(null);
          console.log("Error: please try again");
        }
      }
    });
  }
  return (
    <>
      {session ? (
        <>
          <nav className="fixed z-50 mx-auto w-full bg-mainBlack p-3 text-white">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/`}>
                <div>
                  <p className="font-bold">BANTAFY</p>
                </div>
              </Link>
              <div className="w-[40rem]">
                <form onSubmit={searchSpotify}>
                  <label
                    htmlFor="default-search"
                    className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      ref={inputRef}
                      type="search"
                      id="default-search"
                      className="block w-full rounded-3xl border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900"
                      placeholder="Search artist, song, album..."
                      onClick={() => setResultsHidden(false)}
                      required
                    />
                    {/* <button
                  type="submit"
                  class="absolute right-2.5 bottom-2.5 rounded-lg bg-spotifyGreen px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  Search
                </button> */}
                  </div>
                </form>
              </div>
              
              <div>
                <button className={`flex items-center xs:w-12 xs:h-12 customMd:w-auto customMd:h-auto`} onClick={() => setUserOptionsDisplayed(prevState => !prevState)}>
                  <Image
                    className={`rounded-full w-12 h-12 flex-shrink-0`}
                    src={user_image ? user_image : "https://developer.spotify.com/images/guidelines/design/icon4@2x.png"}
                    alt="Profile Pic"
                    width={100}
                    height={100}
                  />
                  <span className="pl-2 xs:hidden customMd:inline">{user_name}</span>
                </button>
              
                {userOptionsDisplayed &&
                  <button className="xs:right-1 customMd:right-auto bg-spotifyBlack drop-shadow-xl py-1 px-4 fixed mt-1 border-2 border-gray-600"
                    onClick={async () => {
                      nookies.destroy(null, '__spotifyToken');
                      nookies.destroy(null, '__spotifyRefreshToken');
                      await supabase.auth.signOut();
                      router.push("/");
                    }}
                  >
                    Logout
                  </button> 
                }
              </div>
            </div>
          </nav>
          <AnimatePresence>
            <motion.div
              className={`fixed pt-20 inset-x-0 z-20 mx-auto w-max ${
                resultsHidden ? `invisible` : `visible`
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {searchResults ? (
                <>
                  <div
                    onClick={() => setResultsHidden(true)}
                    className="fixed left-0 bottom-0 h-full w-full bg-mainBlack opacity-80"
                  ></div>
                  <div
                    className={`max-h-[67rem] max-w-[110rem] overflow-y-auto rounded-xl bg-spotifyGreen p-2 drop-shadow-md overflow-x-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-900`}
                  >
                    <span
                      onClick={() => setResultsHidden(true)}
                      className="float-right cursor-pointer text-2xl font-bold"
                    >
                      X
                    </span>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Albums
                    </h1>
                    <CategoryResults categories={searchResults.albums} onClick={() => setResultsHidden(true)}/>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Artists
                    </h1>
                    <CategoryResults categories={searchResults.artists} onClick={() => setResultsHidden(true)}/>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Tracks
                    </h1>
                    <CategoryResults categories={searchResults.tracks} onClick={() => setResultsHidden(true)}/>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Shows
                    </h1>
                    <CategoryResults categories={searchResults.shows} onClick={() => setResultsHidden(true)}/>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Audiobooks
                    </h1>
                    <CategoryResults categories={searchResults.audiobooks} onClick={() => setResultsHidden(true)}/>
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Playlists
                    </h1>
                    <CategoryResults categories={searchResults.playlists} onClick={() => setResultsHidden(true)}/>
                  </div>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </>
      ) : 
      <nav className="fixed z-50 mx-auto w-full bg-mainBlack p-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/`}>
            <div>
              <p className="font-bold">BANTAFY</p>
            </div>
          </Link>
        </div>
      </nav>
      }
    </>
  );
}
