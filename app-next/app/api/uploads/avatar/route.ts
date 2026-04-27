import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { uploadAvatar, deleteByUrl } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File must be 1B–${MAX_BYTES} bytes` },
      { status: 400 },
    );
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WEBP supported" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  });

  const { url } = await uploadAvatar(session.user.id, file);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: url },
  });

  if (existing?.avatarUrl && existing.avatarUrl !== url) {
    deleteByUrl(existing.avatarUrl).catch((err) => {
      console.error("avatar cleanup failed", err);
    });
  }

  return NextResponse.json({ url });
}
