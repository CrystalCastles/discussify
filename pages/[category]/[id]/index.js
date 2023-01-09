import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getMediaById } from '../../../lib/spotify';
import { getMediaContent, addMediaContent } from '../../../lib/supabase';
import placeholderImage from "../../../public/no-image-placeholder.jpg";

export default function ContentPage(props) {
  return (
    <div>Hello</div>
  )
}

export async function getServerSideProps(ctx) {
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const { category } = ctx.params;
  const { id } = ctx.params;
  const token = session?.provider_token;

  if(!session || !session?.user?.user_metadata?.name || !session.provider_token || !ctx.params) {
    await supabase.auth.signOut();
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let mediaData = await getMediaContent(id);
  console.log("1" + mediaData)
  if(!mediaData) {
    let media = await getMediaById(token, category, id)
  
    mediaData = {id: media.id, media_type: media.type, media_img: media.type == "track"
    ? media.album.images[1]?.url || placeholderImage.src
    : (media.images[1]?.url || media.images[0]?.url ) || placeholderImage.src, media_link: media.external_urls.spotify, media_name: media.name};

    switch(media.type) {
      case 'artist':
        mediaData = { ...mediaData}
        break;
      case 'album':
        mediaData = { ...mediaData, media_release_date: media.release_date, media_count: media.total_tracks, artist_name: media.artists[0].name}
        break;
      case 'track':
        mediaData = { ...mediaData, media_release_date: media.album.release_date, media_duration: media.duration_ms, artist_name: media.artists[0].name, album_name: media.album.name}
        break;
      case 'show':
        mediaData = { ...mediaData, media_count: media.total_episodes, artist_name: media.publisher}
        break;
      case 'audiobook':
        mediaData = { ...mediaData, artist_name: media.authors[0].name}
        break;
      case 'playlist':
        mediaData = { ...mediaData, media_count: media.tracks.total, artist_name: media.owner.display_name}
        break;
    }
    await addMediaContent(mediaData);
  }

  console.log(mediaData)
  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
}