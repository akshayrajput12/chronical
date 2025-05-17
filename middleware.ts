import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware(async (auth, req) => {
  // Public routes are configured in the matcher below

  // If the user is trying to access an admin route but isn't signed in,
  // redirect them to the sign-in page
  const { userId, redirectToSignIn } = await auth();

  if (!userId && req.nextUrl.pathname.startsWith("/admin")) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If the user is signed in and trying to access an admin route,
  // check if they have the admin role
  if (userId && req.nextUrl.pathname.startsWith("/admin")) {
    // In a real app, you would check the user's role from Clerk's public metadata
    // For now, we'll allow any authenticated user to access admin routes
    // If they don't have the admin role, redirect them to the home page
    // if (!auth.sessionClaims?.metadata?.role === "admin") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }
  }

  // Allow the user to access the route
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/((?!api|_next|.*\\..*).+)"
  ],
};
