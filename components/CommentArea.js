import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGetComments } from "../hooks/useGetComments";
import { commentsUpdated, getComments } from "../lib/supabase";
import InputArea from "./InputArea"
import Comment from "./Comment"

export default function MessagingArea(props) {
  const router = useRouter();
  const mediaId = router.query.id;
  const {data: comments} = useGetComments(mediaId);
  const [updatedComments, setComments] = useState(props.initialComments);
  const [snapType, setSnapType] = useState("mandatory");

  useEffect(() => {
    if(comments) {
      setComments(comments);
    }
  }, [comments]);

  useEffect(() => {
    commentsUpdated(["/api/comments/retrieve", mediaId]);
    console.log("ay")
    router.events.on("routeChangeComplete", () => {
      commentsUpdated(["/api/comments/retrieve", mediaId]);
      console.log("ay2")
    });
  }, [router.events]);

  useEffect(() => {
    setSnapType("proximity");
  }, []);

  return (
    <div className="mx-auto max-w-[100rem]">
      <div className={`h-[36rem] overflow-y-scroll overflow-x-hidden scrollbar-thumb-spotifyBlack scrollbar-track-gray-100 scrollbar-thin snap-y snap-${snapType} overscroll-y-contain`}>
        {updatedComments.length > 0 ? updatedComments?.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).map((content) => {
          return <Comment className="last:snap-end" key={content.id} comment={content} session={props.session}/>
        }) : <h1 className="text-white text-center mt-16 text-lg">No comments, be the first!</h1>}
      </div>
      <div className="w-full">
        <InputArea session={props.session}/>
      </div>
    </div>
  )
}