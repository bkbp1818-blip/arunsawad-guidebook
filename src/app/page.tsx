import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getLocations() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });
  return locations;
}

export default async function Home() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          {/* Logo / Brand */}
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              ARUN SA WAD
            </h1>
            <p className="mt-2 text-lg text-muted-foreground sm:text-xl">
              อรุณสวัสดิ์
            </p>
            <div className="mx-auto mt-6 h-1 w-24 bg-gradient-to-r from-primary via-accent to-secondary" />
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Your curated guide to Bangkok&apos;s hidden gems. <br className="hidden sm:block" />
              Discover local favorites, secret spots, and authentic experiences.
            </p>
          </div>
        </div>
      </header>

      {/* Location Selection */}
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            Choose Your Location
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select where you&apos;re staying to explore nearby recommendations
          </p>
        </div>

        {/* Location Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/${location.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Decorative Corner */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 transition-transform duration-300 group-hover:scale-150" />

              <div className="relative">
                {/* Location Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>

                {/* Location Name */}
                <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                  {location.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {location.nameThai}
                </p>

                {/* Tagline */}
                {location.tagline && (
                  <p className="mt-3 text-sm font-medium text-primary">
                    {location.tagline}
                  </p>
                )}

                {/* Description */}
                {location.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {location.description}
                  </p>
                )}

                {/* CTA */}
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  <span>Explore Guide</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Locations Fallback */}
        {locations.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-serif text-lg font-medium text-foreground">
              No locations available
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Locations will appear here once they are added.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-serif text-lg font-semibold text-foreground">
                ARUN SA WAD
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Boutique Hostels in Bangkok
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ARUN SA WAD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
