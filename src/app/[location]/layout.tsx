import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Home, Wifi, Map, MessageCircle, BookOpen, ArrowLeft } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getLocation(slug: string) {
  const location = await prisma.location.findUnique({
    where: { slug },
  });
  return location;
}

export default async function LocationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ location: string }>;
}) {
  const { location: slug } = await params;
  const location = await getLocation(slug);

  if (!location) {
    notFound();
  }

  const navItems = [
    { href: `/${slug}`, icon: Home, label: "Home" },
    { href: `/${slug}/welcome`, icon: Wifi, label: "Welcome" },
    { href: `/${slug}/explore`, icon: Map, label: "Explore" },
    { href: `/${slug}/phrases`, icon: BookOpen, label: "Thai" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">
                {location.name}
              </h1>
              <p className="text-xs text-muted-foreground">{location.nameThai}</p>
            </div>
          </div>
          {location.tagline && (
            <span className="hidden text-sm text-primary sm:block">
              {location.tagline}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
