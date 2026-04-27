import type { NextAuthConfig } from "next-auth";

// Edge-safe Auth.js config (no Prisma, no Node-only deps).
// Imported by proxy.ts and by the full auth.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/login",
  },
  providers: [], // populated in auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthed = !!auth?.user;
      const isAppRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/symptoms") ||
        nextUrl.pathname.startsWith("/diabetes") ||
        nextUrl.pathname.startsWith("/medications") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/share") ||
        nextUrl.pathname.startsWith("/settings");
      const isAuthRoute =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/signup" ||
        nextUrl.pathname === "/forgot-password";

      if (isAppRoute) return isAuthed;
      if (isAuthRoute && isAuthed) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
