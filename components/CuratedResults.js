import placeholderImage from "../public/no-image-placeholder.jpg";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function CuratedResults(props) {
  return (
    <div className={`grid justify-center sm:grid-cols-2 ${props.className}`}>
      {props.media.items.length > 0 ? (
        props.media.items.map((item) => {
          return (
            <AnimatePresence>
              <Link href={`/${item.track.type}/${item.track.id}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="m-auto max-w-[15rem] p-1"
                >
                  <img
                    className="m-auto max-w-[13rem] cursor-pointer drop-shadow-lg"
                    src={item.track.album.images[1].url || placeholderImage.src}
                    alt={item.track.name}
                  />
                  <p className="ml-3 text-white">
                    {item.track.artists[0].name} - {item.track.name}
                  </p>
                </motion.div>
              </Link>
            </AnimatePresence>
          );
        })
      ) : (
        <span className="float-left text-lg text-white">No results.</span>
      )}
    </div>
  );
}

export default CuratedResults;
