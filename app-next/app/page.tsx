import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <span className="font-semibold tracking-tight">PATCH</span>
        <nav className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Track your health. Share clearly with your doctor.
          </h1>
          <p className="text-lg text-muted-foreground">
            Log symptoms, blood sugar, and medications. Generate clean reports
            for your appointments — no more hunting through notes.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Create your account
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
