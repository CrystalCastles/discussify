import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGetComments } from "../hooks/useGetComments";
import { commentsUpdated, getComments } from "../lib/supabase";
import InputArea from "./InputArea"
import Comment from "./Comment"
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function CommentArea(props) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const mediaId = router.query.id;
  const {data: comments, mutate} = useGetComments(mediaId);
  const [updatedComments, setComments] = useState(props.initialComments);
  const [snapType, setSnapType] = useState("mandatory");
  const [channel, setChannel] = useState();
  
  useEffect(() => {
    if(comments) {
      setComments(comments);
    }
  }, [comments]);

  useEffect(() => {
    if(channel) {
      return;
    }
    setChannel(
      supabase
        .channel(channel)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'media_comments', filter: `chat_id=eq.${mediaId}` }, (payload) => {
          if(payload.eventType === "INSERT") {
            mutate((currentData) => [...currentData, payload.new])
          } else if (payload.eventType === "DELETE") {
            mutate((currentData) => currentData.filter(data => data.id !== payload.old.id))
          }
        })
        .subscribe()
    )
    return () => {
      if(channel) {
        base.removeChannel(mySubscription);
        setChannel(undefined);
      }
    };
  }, [channel, mutate]);

  useEffect(() => {
    setSnapType("proximity");
  }, []);
  
  return (
    <div className="mx-auto max-w-[100rem]">
      <div className={`h-[43rem] overflow-y-scroll overflow-x-hidden scrollbar-thumb-spotifyBlack scrollbar-track-gray-100 scrollbar-thin snap-y snap-${snapType} overscroll-y-contain`}>
        {updatedComments.length > 0 ? updatedComments?.map((content) => {
          return <Comment className="last:snap-end" key={content.id} comment={content} session={props.session}/>
        }) : <h1 className="text-white text-center mt-16 text-lg">No comments, be the first!</h1>}
      </div>
      <div className="w-full">
        <InputArea session={props.session}/>
      </div>
    </div>
  )
}