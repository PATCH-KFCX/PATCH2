import { put, del } from "@vercel/blob";

export interface StorageObject {
  url: string;
  pathname: string;
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<StorageObject> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const pathname = `avatars/${userId}/${Date.now()}.${ext}`;
  const result = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });
  return { url: result.url, pathname: result.pathname };
}

export async function deleteByUrl(url: string): Promise<void> {
  await del(url);
}
