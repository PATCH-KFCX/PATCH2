import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TTL_MS = 60 * 60 * 1000; // 1h

function token() {
  return randomBytes(32).toString("hex");
}

function nsKey(kind: "verify" | "reset", email: string) {
  return `${kind}:${email.toLowerCase()}`;
}

export async function issueVerifyToken(email: string) {
  const t = token();
  await prisma.verificationToken.create({
    data: {
      identifier: nsKey("verify", email),
      token: t,
      expires: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });
  return t;
}

export async function consumeVerifyToken(email: string, t: string) {
  const row = await prisma.verificationToken.findUnique({
    where: { token: t },
  });
  if (!row) return false;
  if (row.identifier !== nsKey("verify", email)) return false;
  if (row.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: t } });
    return false;
  }
  await prisma.verificationToken.delete({ where: { token: t } });
  return true;
}

export async function issueResetToken(email: string) {
  const t = token();
  await prisma.verificationToken.create({
    data: {
      identifier: nsKey("reset", email),
      token: t,
      expires: new Date(Date.now() + RESET_TTL_MS),
    },
  });
  return t;
}

export async function consumeResetToken(t: string) {
  const row = await prisma.verificationToken.findUnique({
    where: { token: t },
  });
  if (!row) return null;
  if (!row.identifier.startsWith("reset:")) return null;
  if (row.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: t } });
    return null;
  }
  await prisma.verificationToken.delete({ where: { token: t } });
  return row.identifier.slice("reset:".length);
}
