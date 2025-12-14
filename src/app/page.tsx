import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Wifi, Map, MessageCircle, MapPin, Calendar, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getHomeData() {
  const [locations, dailyPicks, upcomingEvents] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.dailyPick.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    prisma.event.findMany({
      where: { isActive: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
      include: { location: true },
    }),
  ]);
  return { locations, dailyPicks, upcomingEvents };
}

export default async function Home() {
  const { locations, dailyPicks, upcomingEvents } = await getHomeData();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Mobile Optimized */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              ARUN SA WAD
            </h1>
            <p className="mt-1 text-base text-muted-foreground sm:text-lg">
              อรุณสวัสดิ์ | Your Local Guide
            </p>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-primary via-accent to-secondary" />
          </div>
        </div>
      </header>

      {/* Quick Action Bar - Thumb Friendly */}
      <section className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="grid grid-cols-3 gap-3">
            <Link href="/info#wifi">
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-1 py-3 hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <Wifi className="h-5 w-5" />
                <span className="text-xs font-medium">Connect WiFi</span>
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-1 py-3 hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
              >
                <Map className="h-5 w-5" />
                <span className="text-xs font-medium">Explore Map</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-1 py-3 hover:bg-accent/20 hover:text-accent-foreground hover:border-accent"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs font-medium">Ask Chao</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Today's Pick */}
        {dailyPicks.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Today&apos;s Pick
              </h2>
            </div>
            <div className="space-y-3">
              {dailyPicks.map((pick) => (
                <Card key={pick.id} className="overflow-hidden border-accent/30 bg-accent/5">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground">{pick.title}</h3>
                    {pick.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {pick.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Preview */}
        {upcomingEvents.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Upcoming Events
                </h2>
              </div>
              <Link href="/community" className="text-sm text-primary hover:underline">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href="/community">
                  <Card className="transition-all hover:shadow-md hover:border-primary/30">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.time} {event.location && `@ ${event.location.name}`}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Our Locations */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Our Locations
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <Link key={location.id} href="/info">
                <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {location.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{location.nameThai}</p>
                    {location.tagline && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {location.tagline}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link href="/explore">
            <Card className="group h-full transition-all hover:shadow-lg hover:border-secondary/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                  <Map className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Explore Nearby
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Restaurants, cafes, bars & more
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/chat">
            <Card className="group h-full transition-all hover:shadow-lg hover:border-accent/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground transition-colors group-hover:bg-accent">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Ask Chao
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your AI local guide
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">
                ARUN SA WAD
              </p>
              <p className="text-sm text-muted-foreground">
                Boutique Hostels in Bangkok
              </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/info" className="hover:text-primary">Info</Link>
              <Link href="/explore" className="hover:text-primary">Explore</Link>
              <Link href="/community" className="hover:text-primary">Community</Link>
              <Link href="/chat" className="hover:text-primary">Chat</Link>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ARUN SA WAD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
