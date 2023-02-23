import placeholderImage from "../public/no-image-placeholder.jpg";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function CuratedResults(props) {
  return (
    <div className={`grid justify-center xs:grid-cols-2 2sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 3xl:grid-cols-3 2xl:gap-x-5 ${props.className}`}>
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
                    className="m-auto mt-3 p-3 xs:w-[10rem] 2sm:w-[14rem] bg-spotifyBlack xs:h-[15rem] 2sm:h-[19rem] rounded-lg"
                  >
                    <img
                      className="m-auto w-[13rem] max-h-[15rem] cursor-pointer drop-shadow-lg"
                      src={item.track.album.images[1].url || placeholderImage.src}
                      alt={item.track.name}
                    />
                    <p className="text-white mt-1 font-bold xs:text-sm 2sm:text-base">
                      {item.track.artists[0].name}
                    </p>
                    <p className="text-white mt-1 xs:text-sm 2sm:text-base">
                      {item.track.name && item.track.name}
                    </p>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <span className="text-[1.5rem] text-white">No results.</span>
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
                  className="m-auto mt-3 p-3 xs:w-[10rem] 2sm:w-[14rem] bg-spotifyBlack xs:h-[15rem] 2sm:h-[19rem] rounded-lg"
                >
                  <img
                    className="m-auto w-[13rem] max-h-[15rem] cursor-pointer drop-shadow-lg"
                    src={item.images[1].url || placeholderImage.src}
                    alt={item.name}
                  />
                  <p className="text-white mt-1 font-bold xs:text-sm 2sm:text-base">
                    {item.artists[0].name}
                  </p>
                  <p className="text-white mt-1 xs:text-sm 2sm:text-base">
                    {item.name && item.name}
                  </p>
                </motion.div>
              </Link>
            );
          })
        ) : (
          <span className="text-[1.5rem] text-white">No results.</span>
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
                    className="m-auto mt-3 p-3 xs:w-[10rem] 2sm:w-[14rem] bg-spotifyBlack xs:h-[15rem] 2sm:h-[19rem] rounded-lg"
                  >
                    <img
                      className="m-auto w-[13rem] max-h-[15rem] cursor-pointer drop-shadow-lg"
                      src={item.media_img || placeholderImage.src}
                      alt={item.media_name}
                    />
                    <p className="text-white mt-1 font-bold xs:text-sm 2sm:text-base">
                      {item.artist_name}
                    </p>
                    <p className="text-white mt-1 xs:text-sm 2sm:text-base">
                      {item.media_name && item.media_name}
                    </p>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <span className="text-[1.5rem] text-white">No results.</span>
          )}
        </>
        }
      </AnimatePresence>
    </div>
  );
}

export default CuratedResults;
