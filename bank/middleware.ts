import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/config";
import { createServerClient } from "@supabase/ssr";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  let response: NextResponse;

  try {
    response = handleI18nRouting(request);
  } catch {
    response = NextResponse.next();
  }

  // Refresh Supabase session and attach cookies to the response
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });
      await supabase.auth.getSession();
    }
  } catch {
    // Supabase not configured — skip session refresh
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
