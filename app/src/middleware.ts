import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  protectedRoutes, // Add this
} from "./routes";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedin = !!req.auth;

  console.log("🔐 req.auth =", req.auth);
  console.log("Path:", nextUrl.pathname, " | Logged In:", isLoggedin);

  if (nextUrl.pathname.startsWith(apiAuthPrefix)) return;

  if (authRoutes.includes(nextUrl.pathname)) {
    if (isLoggedin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (
    !isLoggedin &&
    (isProtected || !publicRoutes.includes(nextUrl.pathname))
  ) {
    return Response.redirect(new URL("/auth/signin", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
