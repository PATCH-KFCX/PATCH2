import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";
import { loginInput } from "@/lib/validators/user";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(raw) {
      const parsed = loginInput.safeParse(raw);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!user?.passwordHash) return null;

      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        image: user.avatarUrl ?? null,
      };
    },
  }),
];

// Only register the Resend (magic-link) provider if it's actually configured.
// Without RESEND_API_KEY the provider's network call would 500 every signIn,
// and on some Auth.js versions the constructor itself throws — taking down
// /api/auth/session at module load.
if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "PATCH <onboarding@resend.dev>",
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
});
