import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Droplets,
  Pill,
  FileDown,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "PATCH — Track your health. Show up prepared.",
  description:
    "PATCH helps patients log symptoms, blood sugar, and medications and share clean reports with their care team.",
};

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Trust />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight inline-flex items-center gap-2"
        >
          <span className="inline-block h-6 w-6 rounded-md bg-primary" />
          PATCH
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="#features"
            className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
          >
            How it works
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent -z-10" />
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 grid gap-10 lg:grid-cols-[1.05fr_1fr] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Designed with patients managing chronic conditions
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            Track your health.{" "}
            <span className="text-primary">Show up prepared.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            PATCH is a simple, private journal for your symptoms, blood sugar,
            and medications. Bring real data — not vague memories — to your
            next appointment.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Create your free account
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Sign in
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card. Verify your email anytime.
          </p>
        </div>
        <div className="relative aspect-4/5 sm:aspect-5/4 lg:aspect-square w-full rounded-2xl overflow-hidden border shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=80"
            alt="A patient reviewing health notes with their doctor"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-lg bg-background/95 backdrop-blur-sm border p-3 text-sm">
            <Activity className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs leading-snug">
              <strong>Severity dropped 30%</strong> after switching meds.
              <br />
              <span className="text-muted-foreground">
                Last 30 days · symptom log
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-y bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Doctor visits shouldn&apos;t feel like a memory test.
        </h2>
        <p className="text-lg text-muted-foreground">
          When did the headaches start? Was your fasting glucose high last
          week? Did you take both doses on Tuesday? Without a record, even
          careful patients drop important details — and clinicians have to
          guess.
        </p>
      </div>
    </section>
  );
}

interface Feature {
  icon: typeof Activity;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Activity,
    title: "Symptom journal",
    description:
      "Log severity (1–10), symptoms, pain types, and locations. Search by date or keyword. Watch trends emerge in a clear severity-over-time chart.",
  },
  {
    icon: Droplets,
    title: "Blood sugar tracking",
    description:
      "Tag readings as fasting, pre- or post-meal, bedtime, or random. PATCH calculates your average, estimated A1c, and time-in-range automatically.",
  },
  {
    icon: Pill,
    title: "Medications & adherence",
    description:
      "Build flexible schedules (multiple times per day, specific weekdays). Log doses with one tap. See your last-30-day adherence at a glance.",
  },
  {
    icon: FileDown,
    title: "Doctor-ready reports",
    description:
      "Generate clean PDF or CSV exports for any date range. Share an expirable link or print and bring it in. Your visit, on paper.",
  },
  {
    icon: Bell,
    title: "Reminders",
    description:
      "Email reminders for medications and weekly summaries. Daily nudges to keep your streak alive — no nagging, just a gentle hand.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Your data is yours. Encrypted at rest. Share links are time-limited and revocable. Delete your account and we delete everything.",
  },
];

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Everything in one place
        </h2>
        <p className="text-muted-foreground">
          Three trackers, one timeline. Built around how patients with chronic
          conditions actually live.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    description:
      "Sign up in seconds with an email and password. No credit card. Skip the email verification until later — you're in right away.",
  },
  {
    n: "2",
    title: "Log entries quickly",
    description:
      "Quick-log dialogs from the dashboard, or full forms when you have details. Most entries take under 30 seconds.",
  },
  {
    n: "3",
    title: "Share with your care team",
    description:
      "Generate a PDF report, send a time-limited link, or download a CSV. No scrambling the morning of an appointment.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three steps from sign-up to a useful record.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-xl border bg-background p-6 space-y-3"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {s.n}
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
      <div className="rounded-2xl border bg-background p-8 sm:p-10 grid gap-6 sm:grid-cols-[auto_1fr] items-start">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            Your health data stays yours.
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PATCH stores your records on encrypted infrastructure (Vercel +
            Neon Postgres). Share links you create are scoped to specific
            trackers and date ranges, expire automatically, and can be revoked
            at any time. Delete your account and every row of your data goes
            with it.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-t bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Start tracking today.
        </h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto">
          Free. Takes a minute. Your future self (and your doctor) will thank
          you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-5 py-2 text-sm font-medium hover:bg-background/90"
          >
            Create your free account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 px-5 py-2 text-sm font-medium hover:bg-primary-foreground/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} PATCH. Your health, your record.</p>
        <p className="opacity-70">
          PATCH is for personal tracking and is not a substitute for medical
          advice.
        </p>
      </div>
    </footer>
  );
}
