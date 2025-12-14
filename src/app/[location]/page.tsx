import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import {
  Wifi,
  MapPin,
  Clock,
  Phone,
  Coffee,
  Utensils,
  Wine,
  Landmark,
  Star,
  ChevronRight,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getLocationWithPlaces(slug: string) {
  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      places: {
        where: { isActive: true, isHostelChoice: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return location;
}

const categoryIcons: Record<string, typeof Coffee> = {
  CAFE: Coffee,
  STREET_FOOD: Utensils,
  RESTAURANT: Utensils,
  BAR: Wine,
  CULTURAL: Landmark,
  MARKET: MapPin,
  TRANSPORT: MapPin,
};

export default async function LocationHome({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location: slug } = await params;
  const location = await getLocationWithPlaces(slug);

  if (!location) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Hero Section */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/10" />

          <div className="relative">
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Welcome to {location.name}
            </h2>
            <p className="mt-1 text-muted-foreground">{location.nameThai}</p>
            {location.description && (
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {location.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link href={`/${slug}/welcome`}>
            <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wifi className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium">WiFi & Info</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${slug}/explore`}>
            <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium">Explore Map</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${slug}/phrases`}>
            <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                  <span className="text-xl font-bold">ก</span>
                </div>
                <p className="mt-2 text-sm font-medium">Thai Phrases</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-xl">🐉</span>
                </div>
                <p className="mt-2 text-sm font-medium">Ask เจ้าสัว</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Essential Info */}
      <section className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Essential Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Check-in / Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {location.checkInTime} / {location.checkOutTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Emergency Contact</p>
                <a
                  href={`tel:${location.emergencyPhone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {location.emergencyPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Wifi className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">WiFi</p>
                <p className="text-sm text-muted-foreground">
                  {location.wifiName}
                </p>
              </div>
            </div>

            {location.spotifyPlaylist && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Headphones className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Our Playlist</p>
                  <a
                    href={location.spotifyPlaylist}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Listen on Spotify
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Hostel's Choice */}
      {location.places.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              <span className="mr-2">⭐</span>
              Hostel&apos;s Choice
            </h3>
            <Link href={`/${slug}/explore`}>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {location.places.map((place) => {
              const Icon = categoryIcons[place.category] || MapPin;
              return (
                <Card key={place.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium">
                        <Star className="h-3 w-3 fill-current" />
                        Choice
                      </div>
                    </div>

                    <h4 className="font-medium text-foreground">{place.name}</h4>
                    {place.nameThai && (
                      <p className="text-sm text-muted-foreground">{place.nameThai}</p>
                    )}

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {place.description}
                    </p>

                    {place.mustTry && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium text-primary">Must try:</span>{" "}
                        <span className="text-muted-foreground">{place.mustTry}</span>
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {place.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Address */}
      <section>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Our Address</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {location.address}
                </p>
                {location.addressThai && (
                  <p className="text-sm text-muted-foreground">
                    {location.addressThai}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
