import { NextResponse } from "next/server";

// Public diagnostic endpoint. Reports env-var presence (NEVER values) and a
// quick DB ping. Hit this to figure out why /api/auth/session is 500'ing on
// a fresh deploy.

const REQUIRED_ENV = [
  "DATABASE_URL",
  "AUTH_SECRET",
] as const;

const OPTIONAL_ENV = [
  "DIRECT_URL",
  "NEXTAUTH_URL",
  "AUTH_URL",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "BLOB_READ_WRITE_TOKEN",
  "CRON_SECRET",
] as const;

export async function GET() {
  const env: Record<string, "set" | "missing"> = {};
  for (const k of REQUIRED_ENV) env[k] = process.env[k] ? "set" : "missing";
  for (const k of OPTIONAL_ENV) env[k] = process.env[k] ? "set" : "missing";

  const missingRequired = REQUIRED_ENV.filter((k) => !process.env[k]);

  let db: { status: "ok" | "error"; error?: string } = { status: "ok" };
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db");
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      db = {
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } else {
    db = { status: "error", error: "DATABASE_URL not set" };
  }

  const ok = missingRequired.length === 0 && db.status === "ok";

  return NextResponse.json(
    {
      ok,
      env,
      missingRequired,
      db,
      nodeEnv: process.env.NODE_ENV,
    },
    { status: ok ? 200 : 503 },
  );
}
