import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

export const metadata = { title: "Verify your email — PATCH" };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-sm">Loading…</p>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
