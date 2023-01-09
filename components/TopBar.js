import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import CategoryResults from "../components/CategoryResults";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const router = useRouter();
  const inputRef = useRef();
  const supabase = useSupabaseClient();
  const session = useSession();
  const token = session?.provider_token;

  const [searchResults, setSearchResults] = useState();
  const [searchValue, setSearchValue] = useState();
  const [resultsHidden, setResultsHidden] = useState(true);

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
        token,
      }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.log("Error: please try again");
        setSearchResults(null);
      }
    });
  }
  return (
    <>
      {session ? (
        <>
          <nav className="relative z-50 mx-auto w-full bg-mainBlack p-3 text-white">
            <div className="flex items-center justify-between">
              <Link href={`/`}>
                <div>
                  <p>Logo</p>
                </div>
              </Link>
              <div className="w-[40rem]">
                <form onSubmit={searchSpotify}>
                  <label
                    htmlFor="default-search"
                    class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
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
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
          <AnimatePresence>
            <motion.div
              className={`fixed inset-x-0 z-20 mx-auto w-max ${
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
                    className={`max-h-[70rem] max-w-[110rem] overflow-y-auto rounded-xl bg-spotifyGreen p-2 drop-shadow-md overflow-x-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-900`}
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
                    <CategoryResults categories={searchResults.albums} />
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Artists
                    </h1>
                    <CategoryResults categories={searchResults.artists} />
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Tracks
                    </h1>
                    <CategoryResults categories={searchResults.tracks} />
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Shows
                    </h1>
                    <CategoryResults categories={searchResults.shows} />
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Audiobooks
                    </h1>
                    <CategoryResults categories={searchResults.audiobooks} />
                    <h1 className="text-center text-3xl font-semibold uppercase md:text-left">
                      Playlists
                    </h1>
                    <CategoryResults categories={searchResults.playlists} />
                  </div>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </>
      ) : null}
    </>
  );
}
