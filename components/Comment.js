import { useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";
import TimeAgo from 'react-timeago'

export default function Comment(props){
  const user = props.session.user;
  const commenterId = props.session.user.id;
  let date = new Date(props.comment.created_at);
  date = date.setSeconds(date.getSeconds() - 2);

  async function deleteComment(id) {
    fetch("/api/comments/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        commenterId
      }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
      } 
    });
  }

  return (
    <div className={`${props.className} flex group`}>
      <div className={`flex-shrink-0 order-1 pt-2`}>
        <Image
          className={`object-cover mx-2 rounded-full w-10 h-10`}
          src={props.comment.commenter_avatar ? props.comment.commenter_avatar : "https://i.scdn.co/image/ab6775700000ee85370f9e91c1e33cffcc901240"}
          alt="Profile Pic"
          width={100}
          height={100}
        />
      </div>

      <div className={`flex-shrink-0 order-2 py-2 max-w-[calc(100%-56px)]`}>
        <div className={`flex items-end`}>
          <p
            className={`text-[0.8rem] ${props.comment.commenter_name === user.user_metadata.name ? "text-spotifyGreen" : "text-gray-500"}`}>
            {props.comment.commenter_name}
          </p>
          <p
            className={`text-[0.8rem] italic px-1 text-gray-600 text-right`}>
            <TimeAgo date={date} suppressHydrationWarning={true}/>
          </p>
          {props.comment.commenter_name === user.user_metadata.name && <p className="text-white cursor-pointer text-[0.8rem] invisible group-hover:visible ml-1" onClick={() => deleteComment(props.comment.id)}>x</p> }
        </div>
        <div
          className={`text-white rounded-lg w-fit`}>
          <p className="comment break-word">{props.comment.comment}</p>
        </div>
      </div>
    </div>
  )
}