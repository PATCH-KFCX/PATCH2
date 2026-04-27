"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AvatarUpload({
  initialUrl,
  fallback,
}: {
  initialUrl: string | null;
  fallback: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/uploads/avatar", { method: "POST", body: fd });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(data.error ?? "Upload failed.");
      e.target.value = "";
      return;
    }
    const data = (await res.json()) as { url: string };
    setUrl(data.url);
    toast.success("Avatar updated.");
    router.refresh();
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        {url ? <AvatarImage src={url} alt="" /> : null}
        <AvatarFallback className="text-lg">{fallback || "U"}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onPick}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Uploading…" : url ? "Change avatar" : "Upload avatar"}
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG, JPEG, or WEBP. Max 5 MB.
        </p>
      </div>
    </div>
  );
}
