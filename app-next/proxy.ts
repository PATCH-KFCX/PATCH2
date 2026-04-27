import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next 16 renamed `middleware.ts` → `proxy.ts`.
// This is the edge-runtime auth gate; it uses the Prisma-free authConfig.
export default NextAuth(authConfig).auth;

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
