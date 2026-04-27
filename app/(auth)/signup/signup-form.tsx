"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signupInput, type SignupInput } from "@/lib/validators/user";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupInput),
    defaultValues: { email: "", password: "", name: "" },
  });

  async function onSubmit(values: SignupInput) {
    setError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }

    // Auto-sign-in. Email verification is now optional (banner on dashboard).
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (!result || result.error) {
      setError(
        "Account created, but auto-sign-in failed. Try signing in manually.",
      );
      return;
    }
    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        We&apos;ll send a verification link to your email — you can verify
        anytime from your dashboard.
      </p>
    </form>
  );
}
