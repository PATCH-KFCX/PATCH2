import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserMenu } from "@/components/layout/user-menu";
import { VerifyBanner } from "@/components/layout/verify-banner";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userMeta = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  });

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/symptoms", label: "Symptoms" },
    { href: "/diabetes", label: "Diabetes" },
    { href: "/medications", label: "Medications" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="px-6 h-14 flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            PATCH
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <UserMenu
              email={session.user.email ?? ""}
              name={session.user.name ?? null}
              image={session.user.image ?? null}
            />
          </div>
        </div>
      </header>
      {userMeta && !userMeta.emailVerified && (
        <VerifyBanner email={userMeta.email} />
      )}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
