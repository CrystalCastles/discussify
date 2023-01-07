import placeholderImage from '../public/no-image-placeholder.jpg'
import { motion } from "framer-motion"
import Link from 'next/link'

function CategoryResults(props) {
  return (
    <div className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center ${props.className}`}>
      {props.categories.items.length > 0 ? 
      props.categories.items.map((category) => {
        return (
          <Link href={`/${category.type}/${category.id}`}>
            <motion.div whileHover={{ scale: 1.05 }} className="p-1 max-w-[15rem]">
              <img className="m-auto cursor-pointer max-w-[12rem] drop-shadow-lg" src={category.type == "track" ? (category.album.images[1]?.url || placeholderImage.src) : (category.images[1]?.url || placeholderImage.src)} alt={category.name}/>
              <p className="text-center">{category.name}</p>
            </motion.div>
          </Link>
        );
      })
      : <span className='float-left text-lg'>No results.</span>}
    </div>
  );
}

export default CategoryResults;
