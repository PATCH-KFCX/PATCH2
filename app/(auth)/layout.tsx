import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col bg-background">
        <header className="px-6 py-4">
          <Link
            href="/"
            className="font-semibold tracking-tight inline-flex items-center gap-2"
          >
            <span className="inline-block h-6 w-6 rounded-md bg-primary" />
            PATCH
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <footer className="px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PATCH · Your health, your record.
        </footer>
      </div>

      {/* Hero image column (hidden on mobile) */}
      <div className="hidden lg:block relative bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/40 via-primary/10 to-transparent" />
        <div className="absolute inset-0 flex items-end p-10">
          <blockquote className="max-w-md space-y-3 text-white drop-shadow-md">
            <p className="text-lg font-medium leading-snug">
              &ldquo;I used to forget half of what I wanted to tell my doctor.
              Now I just hand them a clean report.&rdquo;
            </p>
            <footer className="text-sm opacity-90">— Maria, Type 2 diabetic</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
