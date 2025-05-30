import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient, CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Update the session first
  const response = await updateSession(request);
  const url = request.nextUrl;

  // Create a Supabase client for auth checks
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is handled by updateSession
        },
        remove(name: string, options: CookieOptions) {
          // This is handled by updateSession
        },
      },
    }
  );

  // Check if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // If the user is trying to access an admin route but isn't signed in,
  // redirect them to the login page
  if (!user && url.pathname.startsWith('/admin')) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access an admin route,
  // we could check if they have the admin role here
  // For now, we'll allow any authenticated user to access admin routes
  // In a real app, you would check the user's role from the database

  // Allow the user to access the route
  return response;
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
