import { until } from "@open-draft/until";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function getMediaContent(id) {
  const base = getClientInstance();
  console.log(id)
  const { error, data: records } = await until(async () => 
    base.from("media").select("*", { count: "exact" }).eq("id", id)
  );
  console.log(error, records)
  if(error !== null || records.data === null) {
    return false;
  }

  return records.data;
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
