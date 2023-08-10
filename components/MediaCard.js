import { AnimatePresence, motion } from "framer-motion";
import ms from "ms";
import Link from "next/link";
import placeholderImage from "../public/no-image-placeholder.jpg";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function MediaCard(props) {
  return (
    <AnimatePresence>
      <div className="xs:grid-row-3 mx-auto grid min-h-[30rem] max-w-[100rem] gap-2 rounded-xl bg-gradient-to-t from-spotifyBlack to-transparent p-4 xs:grid-cols-6 lg:grid-flow-col lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.03 }}
          className="max-w-[28rem] p-1 xs:col-start-1 xs:col-end-7 xs:row-span-1 xs:mx-auto sm:col-start-1 sm:col-end-4 md:mx-0 lg:col-span-2 lg:row-span-3"
        >
          <a
            target="_blank"
            href={props.mediaData.media_link}
            rel="noopener noreferrer"
          >
            <img
              className="max-h-[28rem] w-auto drop-shadow-lg"
              src={props.mediaData.media_img || placeholderImage.src}
              alt={props.mediaData.media_name}
            />
            <p className="pt-2 text-center text-white">
              Listen On{" "}
              <img
                className="m-auto inline h-6"
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
              ></img>
            </p>
          </a>
        </motion.div>
        <div className="relative text-white xs:col-start-1 xs:col-end-7 xs:row-span-1 xs:text-center xs:[&>p]:text-lg xs:[&>h1]:text-[2rem] sm:col-start-4 sm:col-end-7 sm:text-left md:[&>p]:text-xl md:[&>h1]:text-[3rem] lg:col-span-3 lg:row-span-2 lg:[&>p]:text-2xl lg:[&>h1]:text-[4rem]">
          <h2>{props.mediaData.media_type.toUpperCase()}</h2>
          <h1 className="text-[4rem]">{props.mediaData.media_name}</h1>
          {props.mediaData.media_type === "artist" ? (
            <h1>{props.mediaData.artist_name}</h1>
          ) : (
            <p>{props.mediaData.artist_name}</p>
          )}
          <p>{props.mediaData.album_name}</p>
          <p>
            {props.mediaData.media_type === "album" ||
            props.mediaData.media_type === "playlist"
              ? `${props.mediaData.media_count} Tracks`
              : props.mediaData.media_type === "show"
              ? `${props.mediaData.media_count} Episodes`
              : null}
          </p>
          <p>{props.mediaData.media_release_date}</p>
          <p>
            {props.mediaData.media_type === "track"
              ? ms(+props.mediaData.media_duration)
              : null}
          </p>
        </div>
        <div className="xs:col-start-1 xs:col-end-7 lg:col-span-3 lg:row-span-1">
          {props.mediaData.media_type === "track" ? (
            <AudioPlayer
              src={props.mediaData.media_preview}
              loop
              customIcons={{
                loop: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    className="bi bi-spotify"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                  </svg>
                ),
                loopOff: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="#3b3b3b"
                    className="bi bi-spotify"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                  </svg>
                ),
              }}
              style={{ backgroundColor: "#121212" }}
            />
          ) : null}
        </div>
      </div>
    </AnimatePresence>
  );
}
