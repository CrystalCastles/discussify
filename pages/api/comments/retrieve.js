import * as Supabase from "../../../lib/supabase";

export default async (req, res) => {
  if(req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).end();
  }

  if(req.body?.recentlyCommentedOn) {
    res.json(await Supabase.getCommentedOn());
  } else {
    const { mediaId } = req.query;

    if (mediaId == null) {
      return res.status(400).end();
    }

    res.json(await Supabase.getComments(mediaId));
  }
}