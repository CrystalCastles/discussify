import { useState } from "react"
import { useRouter } from 'next/router';
import { useGetComments } from '../hooks/useGetComments';
import {
  useSession,
} from "@supabase/auth-helpers-react";
import { v4 as uuid } from 'uuid'

export default function InputArea(props) {
  const router = useRouter();

  const [input, setInput] = useState('');
  const [chatCooldown, setChatcooldown] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  
  const mediaId = router.query.id;
  // const userId = session?.user?.
  const userName = props.session?.user?.user_metadata?.name;
  const userId = props.session?.user?.id;
  const userAvatar = props.session?.user?.user_metadata?.avatar_url;
  
  const { data: comments, error, mutate } = useGetComments(mediaId);

  async function addComment(e) {
    e.preventDefault();

    if(!input) return;
    
    const commentToSend = input;
    setInput('');
    const id = uuid();

    const comment = {
      id,
      comment: commentToSend,
      chat_id: mediaId,
      commenter_id: userId,
      commenter_name: userName,
      commenter_avatar: userAvatar,
    }
      fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment
        }),
      }).then(async (response) => {
        setCommentCount((prevState) => ++prevState);
        if(commentCount === 0) {
          countdown(10);
        }
        if(commentCount > 3) {
          setChatcooldown(true)
          setInput("");
        }
        // if (response.ok) {
        //   const data = await response.json();
        //   await mutate((currentData) => [...currentData, data])
        // }  
      });
  }

  const countdown = (timeleft) => {
    const countdown = setInterval(() => {
      if(timeleft <= 0){
        clearInterval(countdown);
        setCommentCount(0);
        setChatcooldown(false);
      }
      timeleft -= 1;
    }, 1000);
  }
  
  return (
    <form onSubmit={addComment} className="mx-auto flex pb-5">
      <input type="text" disabled={chatCooldown} placeholder={`${chatCooldown ? "Please wait before sending another message." : "Enter comment here..."} `} className="text-white flex-1 border-b-2 border-l-0 border-r-0 border-t-0 border-white focus:border-spotifyGreen outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0" value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit" disabled={!input} className="px-3 py-2 font-bold text-white text-sm bg-spotifyBlack rounded-2xl hover:bg-spotifyGreen disabled:opacity-50 disabled:cursor-not-allowed">
        Comment
      </button>
    </form>
  )
}