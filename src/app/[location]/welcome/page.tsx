"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Wifi,
  Copy,
  Check,
  Clock,
  Phone,
  Coffee,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  nameThai: string | null;
  wifiName: string;
  wifiPassword: string;
  checkInTime: string;
  checkOutTime: string;
  emergencyPhone: string;
  breakfastInfo: string | null;
  houseRules: string | null;
}

export default function WelcomePage() {
  const params = useParams();
  const slug = params.location as string;
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch(`/api/locations/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setLocation(data);
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLocation();
  }, [slug]);

  const copyPassword = () => {
    if (location?.wifiPassword) {
      navigator.clipboard.writeText(location.wifiPassword);
      setCopied(true);
      toast.success("Password copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate WiFi QR code string
  const wifiQRString = location
    ? `WIFI:T:WPA;S:${location.wifiName};P:${location.wifiPassword};;`
    : "";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Location not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const houseRulesArray = location.houseRules
    ? location.houseRules.split("\\n").filter((rule) => rule.trim())
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Welcome
        </h2>
        <p className="mt-1 text-muted-foreground">
          Everything you need for your stay
        </p>
      </div>

      <Tabs defaultValue="wifi" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="wifi" className="gap-2">
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">WiFi</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Rules</span>
          </TabsTrigger>
        </TabsList>

        {/* WiFi Tab */}
        <TabsContent value="wifi">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-serif">WiFi Connection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Scan QR code or enter manually
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="rounded-2xl border-4 border-primary/20 bg-white p-4">
                  <QRCodeSVG
                    value={wifiQRString}
                    size={200}
                    level="M"
                    includeMargin={false}
                    fgColor="#2D3436"
                  />
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Point your camera at the QR code to connect automatically
              </p>

              {/* Manual Details */}
              <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Network Name
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                    {location.wifiName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Password
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {location.wifiPassword}
                    </p>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={copyPassword}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Check-in/out Times */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Check-in Time</p>
                    <p className="text-2xl font-bold text-primary">
                      {location.checkInTime}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Early check-in subject to availability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Check-out Time</p>
                    <p className="text-2xl font-bold text-secondary">
                      {location.checkOutTime}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Late check-out available on request
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Emergency Contact</p>
                    <a
                      href={`tel:${location.emergencyPhone}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {location.emergencyPhone}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakfast Info */}
            {location.breakfastInfo && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                      <Coffee className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Breakfast</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {location.breakfastInfo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">House Rules</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please help us maintain a comfortable environment for all guests
              </p>
            </CardHeader>
            <CardContent>
              {houseRulesArray.length > 0 ? (
                <ul className="space-y-3">
                  {houseRulesArray.map((rule, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">
                        {rule.replace(/^-\s*/, "")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  No specific house rules listed. Please be respectful of other guests.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
