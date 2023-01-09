import placeholderImage from "../public/no-image-placeholder.jpg";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

function CategoryResults(props) {
  return (
    <div
      className={`grid justify-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 ${props.className} z-10`}
    >
      {props.categories.items.length > 0 ? (
        props.categories.items.map((category) => {
          return (
            <AnimatePresence>
              <Link href={`/${category.type}/${category.id}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="max-w-[15rem] p-1"
                >
                  <img
                    className="m-auto max-w-[12rem] cursor-pointer drop-shadow-lg"
                    src={
                      category.type == "track"
                        ? category.album.images[1]?.url || placeholderImage.src
                        : (category.images[1]?.url || category.images[0]?.url ) || placeholderImage.src
                    }
                    alt={category.name}
                  />
                  <p className="text-center">{category.name}</p>
                </motion.div>
              </Link>
            </AnimatePresence>
          );
        })
      ) : (
        <span className="float-left text-lg">No results.</span>
      )}
    </div>
  );
}

export default CategoryResults;
