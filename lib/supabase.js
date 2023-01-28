import { until } from "@open-draft/until";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { mutate } from "swr";

export function commentsUpdated(key) {
  const base = getClientInstance();
  const mySubscription = base
    .channel(`public:media_comments:chat_id=eq.${key[1]}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'media_comments' }, (payload) => {
      mutate(key), console.log(payload) }
    )
    .subscribe();

  return () => {
    mySubscription.removeChannel();
  };
}

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
    base.from("media_comments").select("*").eq("chat_id", id).order("created_at", {ascending: false}).limit(100)
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

export async function getCommentedOn() {
  const base = getClientInstance();
  const { error, data: record } = await until(async() => 
    base.from("media_entries").select("*").not("last_comment_at", "is", null).order("last_comment_at", {ascending: false}).limit(10)
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


