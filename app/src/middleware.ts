import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  protectedRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedin = !!req.auth;

  let action = "No action (allowed)";

  // Skip API auth routes
  if (pathname.startsWith(apiAuthPrefix)) {
    console.log(`✅ [${pathname}] | API auth route - allowed`);
    return;
  }

  // If user tries to visit sign-in or sign-up routes
  if (authRoutes.includes(pathname)) {
    if (isLoggedin) {
      action = `🔁 Redirected to ${DEFAULT_LOGIN_REDIRECT} (already logged in)`;
      console.log(`🔐 [${pathname}] | Logged In: ${isLoggedin} | ${action}`);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    } else {
      action = "✅ Public auth route - allowed";
      console.log(`🔐 [${pathname}] | Logged In: ${isLoggedin} | ${action}`);
      return;
    }
  }

  // Check if it's a protected route
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isLoggedin && (isProtected || !publicRoutes.includes(pathname))) {
    action = "🔁 Redirected to /auth/signin (unauthenticated)";
    console.log(`🔐 [${pathname}] | Logged In: ${isLoggedin} | ${action}`);
    return Response.redirect(new URL("/auth/signin", nextUrl));
  }

  console.log(`✅ [${pathname}] | Logged In: ${isLoggedin} | ${action}`);
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
