import { until } from "@open-draft/until";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { mutate } from "swr";

// export function commentsUpdated(key) {
//   const base = getClientInstance();
//   const mySubscription = base
//     .channel(`public:media_comments:chat_id=eq.${key[1]}`)
//     .on('postgres_changes', { event: '*', schema: 'public', table: 'media_comments' }, (payload) => {
//       mutate(key), console.log(payload) }
//     )
//     .subscribe();
  
//   return () => {
//     base.removeChannel(mySubscription);
//   };
// }

export async function getMediaContent(id) {
  const base = getClientInstance();

  const { error, data: record } = await until(async () => 
    base.from("media_entries").select("*", { count: "exact" }).eq("id", id)
  );
  
  if(error !== null || record.data === null) {
    return false;
  }

  return record.data[0];
}

export async function addMediaContent(data) {
  const base = getServiceClientInstance();

  const { error, data: record } = await until(async () =>
    base
      .from("media_entries")
      .insert(
        [
          {
            ...data,
          },
        ],
        { returning: "representation" }
      )
      .select()
      .single()
  );

  if (error != null || record.data == null) {
    return null;
  }

  return record.data;
}

export async function getComments(id) {
  const base = getClientInstance();

  const { error, data: record } = await until(async () => 
    base.from("media_comments").select("*").eq("chat_id", id).order("created_at").limit(100)
  );
  
  if(error !== null || record.data === null) {
    return false;
  }

  return record.data;
}

export async function getComment(id) {
  const base = getClientInstance();

  const { error, data: record } = await until(async () => 
    base.from("media_comments").select().eq("id", id).single()
  );
  
  if(error !== null || record.data === null) {
    return false;
  }

  return record.data;
}

export async function addComment(data) {
  const base = getServiceClientInstance();
  
  const { error, data: record } = await until(async () =>
    base
      .from("media_comments")
      .insert(
        [
          {
            ...data,
          },
        ],
        { returning: "representation" }
      )
      .select()
      .single()
  );
  
  if (error != null || record.data == null) {
    return null;
  }

  const { updateMediaError, data: updateMediaRecord } = await until(async () =>
    base
      .from("media_entries")
      .update({last_comment_at: new Date(Date.now())})
      .eq("id", data.chat_id)
      .select()
      .single()
  );
  
  if (updateMediaError != null || updateMediaRecord.data == null) {
    console.log("Error updated media: Recently commented on");
  }

  return record.data;
}

export async function deleteComment(id, commenterId) {
  const base = getServiceClientInstance();
  
  const { error, data: record } = await until(async () =>
    base
      .from("media_comments")
      .delete()
      .match({'id': id, "commenter_id": commenterId})
      .select()
      .single()
  );
  
  if (error != null || record.data == null) {
    return null;
  }

  return record.data;
}

export async function updateCommentScore(id, userId, sentiment) {
  const base = getServiceClientInstance();
  let commentInfo = await getComment(id);
  let upvoted = commentInfo.comment_upvoters?.includes(userId);
  let downvoted = commentInfo.comment_downvoters?.includes(userId);

  if((sentiment == "positive" && upvoted) || (sentiment == "negative" && downvoted)) {
    return null;
  }
  
  const { error, data: record } = await until(async () =>
    base
      .from("media_comments")
      .update(sentiment == "positive" ? {"upvote_count": commentInfo.upvote_count+=1, "comment_upvoters": commentInfo.comment_upvoters ? [...commentInfo.comment_upvoters, userId] : [userId], "downvote_count": downvoted ? commentInfo.downvote_count-=1 : commentInfo.downvote_count, "comment_downvoters": downvoted ? commentInfo.comment_downvoters.filter(downvoters => downvoters != userId) : commentInfo.comment_downvoters} 
        : {"downvote_count": commentInfo.downvote_count+=1, "comment_downvoters": commentInfo.comment_downvoters ? [...commentInfo.comment_downvoters, userId] : [userId], "upvote_count": upvoted ? commentInfo.upvote_count-=1 : commentInfo.upvote_count, "comment_upvoters": upvoted ? commentInfo.comment_upvoters.filter(upvoters => upvoters != userId) : commentInfo.comment_upvoters})
      .eq('id', id)
      .select()
      .single()
  );
  console.log(error, record)
  if (error != null || record.data == null) {
    return null;
  }

  return record.data;
}

export async function getCommentedOn() {
  const base = getClientInstance();
  const { error, data: record } = await until(async() => 
    base.from("media_entries").select("*").not("last_comment_at", "is", null).order("last_comment_at", {ascending: false}).limit(12)
  )

  if(error !== null || record.data === null) {
    return false;
  }
  return record.data;
}

export function getClientInstance() {
  let client = createBrowserSupabaseClient();
  return client;
}

export function getServiceClientInstance() {
  let serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  return serviceClient;
}


