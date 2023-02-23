import { AnimatePresence, motion } from "framer-motion";
import ms from "ms";
import Link from "next/link";
import placeholderImage from "../public/no-image-placeholder.jpg";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function MediaCard(props) {

  return (
    <AnimatePresence>
      <div className="mx-auto bg-gradient-to-t from-spotifyBlack to-transparent grid xs:grid-cols-6 xs:grid-row-3 lg:grid-cols-5 lg:grid-flow-col gap-2 p-4 rounded-xl max-w-[100rem] min-h-[30rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.03 }}
          className="xs:mx-auto md:mx-0 max-w-[28rem] p-1 xs:row-span-1 xs:col-start-1 xs:col-end-7 sm:col-start-1 sm:col-end-4 lg:row-span-3 lg:col-span-2"
        >
          <a target="_blank" href={props.mediaData.media_link} rel="noopener noreferrer">
            <img
              className="drop-shadow-lg w-auto max-h-[28rem]"
              src={props.mediaData.media_img || placeholderImage.src}
              alt={props.mediaData.media_name}
            />
          </a>
        </motion.div>
        <div className="text-white xs:[&>p]:text-lg xs:[&>h1]:text-[2rem] md:[&>p]:text-xl md:[&>h1]:text-[3rem] lg:[&>p]:text-2xl lg:[&>h1]:text-[4rem] relative xs:row-span-1 xs:col-start-1 xs:col-end-7 xs:text-center sm:text-left sm:col-start-4 sm:col-end-7 lg:row-span-2 lg:col-span-3">
          <h2>{props.mediaData.media_type.toUpperCase()}</h2>
          <h1 className="text-[4rem]">{props.mediaData.media_name}</h1>
          {props.mediaData.media_type === "artist" ? <h1>{props.mediaData.artist_name}</h1> : <p>{props.mediaData.artist_name}</p>}
          <p>{props.mediaData.album_name}</p>
          <p>{props.mediaData.media_type === 'album' || props.mediaData.media_type === 'playlist' ? `${props.mediaData.media_count} Tracks` : props.mediaData.media_type === 'show' ?  `${props.mediaData.media_count} Episodes` : null}</p>
          <p>{props.mediaData.media_release_date}</p>
          <p>{props.mediaData.media_type === "track" ? ms(+props.mediaData.media_duration) : null}</p>
        </div>
        <div className="xs:col-start-1 xs:col-end-7 lg:row-span-1 lg:col-span-3">
          {props.mediaData.media_type === "track" ?
            <AudioPlayer
              src={props.mediaData.media_preview}
              loop
              style={{backgroundColor: '#121212'}}
            />
          : null}
        </div>
      </div>
    </AnimatePresence>
  )
}