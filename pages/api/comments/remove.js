import { deleteComment } from "../../../lib/supabase";

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).end();
  }

  const { id } = req.body;
  const { commenterId } = req.body;

  let removedComment = await deleteComment(id, commenterId);

  res.status(200).json(removedComment)
}