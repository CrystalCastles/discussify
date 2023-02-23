import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  if (!session) {
    // No session. Return 401 error.
    return new Response(
      JSON.stringify({ status: "error", detail: "Unauthorized" }),
      {
        status: 401,
      }
    );
  }

  // Authentication successful, forward request to protected route.
  return res;
}

export const config = {
  matcher: "/api/comments/:path*",
};