import { until } from "@open-draft/until";
import ms from "ms";
import useSWR from "swr";

async function fetcher(route, mediaId) {

  if (mediaId == null) {
    throw new Error("Fetch requirements are missing");
  }
  
  const { error: fetchError, data: response } = await until(() =>
    fetch(
      `${route}?mediaId=${mediaId}`
    )
  );
  
  if (fetchError != null || !response.ok) {
    return [];
  }

  const { error: parseError, data } = await until(() => response.json());

  if (parseError != null || data == null) {
    return [];
  }
  
  return data;
}

export function useGetComments(mediaId, options) {
  return useSWR(
    ["/api/comments/retrieve", mediaId],
    fetcher,
    {
      initialData: options?.initialData,
    }
  );
}
