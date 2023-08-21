import * as Supabase from "../../../lib/supabase";

export default async (req, res) => {
  if(req.method !== 'POST') {
    return res.status(405).end();
  }

  let { id, userId, sentiment } = req.body;

  res.json(await Supabase.updateCommentScore(id, userId, sentiment));
}