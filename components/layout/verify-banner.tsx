"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function VerifyBanner({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const [, startTransition] = useTransition();

  async function resend() {
    setSending(true);
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    setSending(false);
    if (!res.ok) {
      toast.error("Could not send verification email.");
      return;
    }
    toast.success(`Verification link sent to ${email}.`);
    startTransition(() => {});
  }

  return (
    <div className="border-b bg-amber-500/10 text-amber-900 dark:text-amber-200">
      <div className="px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          Verify your email <span className="font-medium">{email}</span> to
          unlock account recovery and shareable reports.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={resend}
          disabled={sending}
        >
          {sending ? "Sending…" : "Resend link"}
        </Button>
      </div>
    </div>
  );
}
