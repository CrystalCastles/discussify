import placeholderImage from '../public/no-image-placeholder.jpg'
import { motion } from "framer-motion"
import Link from 'next/link'

function CuratedResults(props) {
  return (
    <div className={`grid sm:grid-cols-2 justify-center ${props.className}`}>
      {props.media.items.length > 0 ? 
      props.media.items.map((item) => {
        return (
          <Link href={`/${item.track.type}/${item.track.id}`}>
            <motion.div whileHover={{ scale: 1.05 }} className="p-1 max-w-[15rem] m-auto">
              <img className="m-auto cursor-pointer max-w-[13rem] drop-shadow-lg" src={(item.track.album.images[1].url || placeholderImage.src)} alt={item.track.name}/>
              <p className="text-white ml-3">{item.track.name}</p>
            </motion.div>
          </Link>
        );
      })
      : <span className='float-left text-lg text-white'>No results.</span>}
    </div>
  );
}

export default CuratedResults;
