import { addComment } from "../../../lib/supabase";

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).end();
  }

  const { comment } = req.body;
  let addedComment = await addComment(comment);

  res.status(200).json(addedComment);
}