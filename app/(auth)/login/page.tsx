import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in — PATCH" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to PATCH.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm">Loading…</p>}>
        <LoginForm />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        New to PATCH?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}
