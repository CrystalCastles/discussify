import placeholderImage from "../public/no-image-placeholder.jpg";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function CuratedResults(props) {
  return (
    <div className={`grid justify-center sm:grid-cols-2 ${props.className}`}>
      <AnimatePresence>
        {props.media?.items ? 
        <>
          {props.media?.items.length > 0 ? (
            props.media?.items.map((item, idx) => {
              return (
                <Link href={`/${item.track.type}/${item.track.id}`} key={`${item.track.id}${idx}A`}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="m-auto max-w-[15rem] p-1 h-[18rem]"
                  >
                    <img
                      className="m-auto max-w-[13rem] cursor-pointer drop-shadow-lg"
                      src={item.track.album.images[1].url || placeholderImage.src}
                      alt={item.track.name}
                    />
                    <p className="ml-3 text-white">
                      {item.track.artists[0].name} {item.track.name ? "- " + item.track.name : null}
                    </p>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <span className="float-left text-lg text-white">No results.</span>
          )}
        </>
        : props.media?.albums ?
        <>
        {props.media?.albums.items.length > 0 ? (
          props.media?.albums.items.map((item, idx) => {
            return (
              <Link href={`/${item.type}/${item.id}`} key={`${item.id}${idx}B`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="m-auto max-w-[15rem] p-1 h-[18rem]"
                >
                  <img
                    className="m-auto max-w-[13rem] cursor-pointer drop-shadow-lg"
                    src={item.images[1].url || placeholderImage.src}
                    alt={item.name}
                  />
                  <p className="ml-3 text-white">
                  {item.artists[0].name} {item.name ? "- " + item.name : null}
                  </p>
                </motion.div>
              </Link>
            );
          })
        ) : (
          <span className="float-left text-lg text-white">No results.</span>
        )}
        </>
        :
        <>
          {props.media?.length > 0 ? (
            props.media?.map((item, idx) => {
              return (
                <Link href={`/${item.media_type}/${item.id}`} key={`${item.id}${idx}C`}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="m-auto max-w-[15rem] p-1 h-[18rem]"
                  >
                    <img
                      className="m-auto max-w-[13rem] cursor-pointer drop-shadow-lg"
                      src={item.media_img || placeholderImage.src}
                      alt={item.media_name}
                    />
                    <p className="ml-3 text-white">
                      {item.artist_name} {item.media_name ? "- " + item.media_name : null}
                    </p>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <span className="float-left text-lg text-white">No results.</span>
          )}
        </>
        }
      </AnimatePresence>
    </div>
  );
}

export default CuratedResults;
