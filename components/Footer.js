import Link from "next/link";

export default function Footer() {
  return (
    <div className="">
      <p className="text-white text-center pt-2">All metadata and media provided by <img className="h-6 m-auto inline" src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"></img></p>
      <p className="text-white text-center pb-2 inline-block">Contact - <a className="text-gray-500" target="_blank" href="https://twitter.com/chunkygerbil" rel="noopener noreferrer">@chunkygerbil</a> <Link href="/terms" className="hover:underline pl-3">Terms of Service</Link> <Link href="/privacy" className="hover:underline pl-3">Privacy Policy</Link></p>
    </div>
  )
}