import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Clock,
  Wifi,
  Coffee,
  Shirt,
  Luggage,
  Phone,
  MapPin,
  Home,
  Volume2,
  Cigarette,
  CreditCard,
  Key,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeSVG } from "qrcode.react";

export const dynamic = "force-dynamic";

async function getLocations() {
  return prisma.location.findMany({ orderBy: { name: "asc" } });
}

export default async function InfoPage() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-lg font-semibold">Hostel Info</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Quick Info Cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-semibold">14:00 (2 PM)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-semibold">12:00 (Noon)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Breakfast</p>
                <p className="font-semibold">7:00 - 10:00 AM</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emergency</p>
                <p className="font-semibold">Reception 24/7</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* House Rules */}
        <section className="mb-8">
          <h2 className="mb-4 font-serif text-xl font-semibold">House Rules</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Volume2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Quiet Hours</p>
                  <p className="text-sm text-muted-foreground">
                    10 PM - 8 AM. Please be respectful of other guests.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Cigarette className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Smoking</p>
                  <p className="text-sm text-muted-foreground">
                    Strictly no smoking inside. Designated areas available.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Key className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Security</p>
                  <p className="text-sm text-muted-foreground">
                    Keep valuables in lockers. Don&apos;t share door codes.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Home className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Common Areas</p>
                  <p className="text-sm text-muted-foreground">
                    Please clean up after yourself. Shoes off indoors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Facilities & Services */}
        <section className="mb-8">
          <h2 className="mb-4 font-serif text-xl font-semibold">Facilities & Services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Wifi className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Free WiFi</p>
                  <p className="text-sm text-muted-foreground">
                    High-speed internet throughout. See QR codes below.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Shirt className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Laundry</p>
                  <p className="text-sm text-muted-foreground">
                    Self-service laundry nearby. Ask reception for directions.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Luggage className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Luggage Storage</p>
                  <p className="text-sm text-muted-foreground">
                    Free storage before check-in and after check-out.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Coffee className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Common Kitchen</p>
                  <p className="text-sm text-muted-foreground">
                    Free tea & coffee. Microwave and fridge available.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <CreditCard className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Tour Booking</p>
                  <p className="text-sm text-muted-foreground">
                    Day trips, train tickets. Ask at reception.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Local Tips</p>
                  <p className="text-sm text-muted-foreground">
                    Ask staff or use our AI guide &quot;Chao&quot; for recommendations!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Location WiFi Cards */}
        <section id="wifi" className="scroll-mt-20">
          <h2 className="mb-4 font-serif text-xl font-semibold">WiFi by Location</h2>
          <Tabs defaultValue={locations[0]?.slug || "chinatown"} className="w-full">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              {locations.map((loc) => (
                <TabsTrigger key={loc.id} value={loc.slug} className="min-w-fit">
                  {loc.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {locations.map((location) => (
              <TabsContent key={location.id} value={location.slug}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {location.name}
                      <span className="text-sm font-normal text-muted-foreground">
                        {location.nameThai}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6 sm:flex-row">
                      {/* WiFi QR Code */}
                      <div className="flex flex-col items-center rounded-lg bg-white p-4">
                        <QRCodeSVG
                          value={`WIFI:T:WPA;S:${location.wifiName};P:${location.wifiPassword};;`}
                          size={150}
                          level="M"
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                          Scan to connect
                        </p>
                      </div>

                      {/* WiFi Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Network Name</p>
                          <p className="font-mono font-semibold">{location.wifiName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Password</p>
                          <p className="font-mono font-semibold">{location.wifiPassword}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="text-sm">{location.address}</p>
                        </div>
                        {location.emergencyPhone && (
                          <div>
                            <p className="text-sm text-muted-foreground">Emergency Contact</p>
                            <p className="font-semibold">{location.emergencyPhone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {location.breakfastInfo && (
                      <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm">
                          <span className="font-medium">Breakfast:</span>{" "}
                          {location.breakfastInfo}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-around p-2">
          <Link href="/" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <Coffee className="h-5 w-5" />
            <span className="text-xs">Community</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <Phone className="h-5 w-5" />
            <span className="text-xs">Ask Chao</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
