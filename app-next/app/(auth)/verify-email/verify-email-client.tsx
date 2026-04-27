"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

type Status = "idle" | "verifying" | "ok" | "error";

export function VerifyEmailClient() {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [status, setStatus] = useState<Status>(token && email ? "verifying" : "idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !email) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });
      if (cancelled) return;
      if (res.ok) {
        setStatus("ok");
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("error");
        setMessage(data.error ?? "Verification failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, email]);

  if (status === "idle") {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent you a verification link. Open it on this device to activate
          your account.
        </p>
      </div>
    );
  }

  if (status === "verifying") {
    return <p className="text-sm">Verifying your email…</p>;
  }

  if (status === "ok") {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>Email verified. You can sign in now.</AlertDescription>
        </Alert>
        <Link href="/login" className={buttonVariants({ size: "lg" }) + " w-full"}>
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertDescription>{message ?? "Verification failed."}</AlertDescription>
      </Alert>
      <Link href="/signup" className={buttonVariants({ variant: "outline", size: "lg" }) + " w-full"}>
        Sign up again
      </Link>
    </div>
  );
}
