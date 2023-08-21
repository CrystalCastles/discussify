import { useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";
import TimeAgo from 'react-timeago';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp, faThumbsDown as regularThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { useState } from "react";

export default function Comment(props){
  const user = props.session.user;
  const userId = props.session.user.id;
  let date = new Date(props.comment.created_at);
  date = date.setSeconds(date.getSeconds() - 2);

  const [upvoted, setUpvoted] = useState(props.comment.comment_upvoters?.includes(userId));
  const [downvoted, setDownvoted] = useState(props.comment.comment_downvoters?.includes(userId));
  const [upvoteCount, setUpvoteCount] = useState(props.comment.upvote_count);
  const [downvoteCount, setDownvoteCount] = useState(props.comment.downvote_count);

  async function deleteComment(id) {
    fetch("/api/comments/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        userId
      }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
      } 
    });
  }

  async function updateCommentScore(id, sentiment) {
    if((sentiment == "positive" && upvoted) || (sentiment == "negative" && downvoted)) {
      return null;
    }

    fetch("/api/comments/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        userId,
        sentiment
      }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        if(sentiment == "positive") {
          setUpvoted(true);
          setDownvoted(false);
          setUpvoteCount(prevState => prevState += 1);
          setDownvoteCount(downvoted ? prevState => prevState -= 1 : downvoteCount);
        } else {
          setDownvoted(true);
          setUpvoted(false);
          setDownvoteCount(prevState => prevState += 1);
          setUpvoteCount(upvoted ? prevState => prevState -= 1 : upvoteCount);
        }
      } 
    });
  }

  function VoteSection() {
    return (
      <div className="text-white text-[0.8rem] relative top-1">
        <span className="cursor-pointer ml-1 inline-block" onClick={() => updateCommentScore(props.comment.id, "positive")}><FontAwesomeIcon icon={upvoted ? solidThumbsUp : regularThumbsUp} /></span>
        <span className="ml-1 inline-block">{upvoteCount}</span>
        <span className="cursor-pointer ml-1 inline-block" onClick={() => updateCommentScore(props.comment.id, "negative")}><FontAwesomeIcon icon={downvoted ? solidThumbsDown : regularThumbsDown} /></span>
        <span className="ml-1 inline-block">{downvoteCount}</span>
      </div>
    )
  }

  return (
    <div className={`${props.className} flex group`}>
      <div className={`flex-shrink-0 order-1 pt-2`}>
        <Image
          className={`object-cover mx-2 rounded-full w-10 h-10`}
          src={props.comment.commenter_avatar ? props.comment.commenter_avatar : "https://developer.spotify.com/images/guidelines/design/icon4@2x.png"}
          alt="Profile Pic"
          width={100}
          height={100}
        />
      </div>

      <div className={`flex-shrink-0 order-2 py-2 max-w-[calc(100%-56px)]`}>
        <div className={`flex items-end`}>
          <p
            className={`text-[0.8rem] ${props.comment.commenter_id === user.id ? "text-spotifyGreen" : "text-gray-500"}`}>
            {props.comment.commenter_name}
          </p>
          <p
            className={`text-[0.8rem] italic px-1 text-gray-600 text-right`}>
            <TimeAgo date={date} suppressHydrationWarning={true}/>
          </p>
          {props.comment.commenter_id === user.id ? <p className="text-white cursor-pointer text-[0.8rem] invisible group-hover:visible ml-1" onClick={() => deleteComment(props.comment.id)}>x</p> : <VoteSection comment={props.comment}/>}
        </div>
        <div
          className={`text-white rounded-lg w-fit`}>
          <p className="comment break-word">{props.comment.comment}</p>
        </div>
      </div>
    </div>
  )
}