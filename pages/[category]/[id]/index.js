import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import MediaCard from '../../../components/MediaCard';
import CommentArea from '../../../components/CommentArea';
import { getMediaById } from '../../../lib/spotify';
import { getMediaContent, addMediaContent, getComments, commentsUpdated } from '../../../lib/supabase';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function ContentPage(props) {
  // const router = useRouter();
  // const { category } = router.query;
  // const { id } = router.query;
  
  // async function retrieveMediaContent(id) {
  //   fetch()
  // }
  
  return (
    <main className="bg-mainBlack px-5 pt-16 min-h-screen overflow-hidden">
      <MediaCard mediaData={props.mediaData} />
      <CommentArea initialComments={props.initialComments} session={props.initialSession}/>
    </main>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  console.log(cookies)

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
  
  if(!mediaData) {
    let media = await getMediaById(token, category, id)
    
    mediaData = {id: media.id, media_type: media.type, media_img: media.type == "track"
    ? (media.album.images[0]?.url || media.album.images[1]?.url || media.album.images[2]?.url || null)
    : (media.images[0]?.url || media.images[1]?.url || media.images[2]?.url ) || null, media_link: media.external_urls.spotify, media_name: media.type != "artist" ? media.name : null};

    switch(media.type) {
      case 'artist':
        mediaData = { ...mediaData, artist_name: media.name}
        break;
      case 'album':
        mediaData = { ...mediaData, media_release_date: media.release_date, media_count: media.total_tracks, artist_name: media.artists[0].name}
        break;
      case 'track':
        mediaData = { ...mediaData, media_release_date: media.album.release_date, media_duration: media.duration_ms, artist_name: media.artists[0].name, album_name: media.album.name, media_preview: media. preview_url}
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

  let initialComments = await getComments(id);
  
  return {
    props: {
      mediaId: id,
      initialComments,
      mediaData,
      initialSession: session,
      user: session.user,
    },
  };
}