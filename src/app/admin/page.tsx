"use client";

// Admin Dashboard - ARUN SA WAD Guidebook
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Utensils, HelpCircle, BookOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  locations: number;
  places: number;
  faqs: number;
  phrases: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    locations: 0,
    places: 0,
    faqs: 0,
    phrases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Locations",
      value: stats.locations,
      icon: MapPin,
      href: "/admin/locations",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Places",
      value: stats.places,
      icon: Utensils,
      href: "/admin/places",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      href: "/admin/faqs",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Thai Phrases",
      value: stats.phrases,
      icon: BookOpen,
      href: "/admin/phrases",
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to ARUN SA WAD Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/places?new=true">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Place
            </Button>
          </Link>
          <Link href="/admin/faqs?new=true">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </Link>
          <Link href="/admin/phrases?new=true">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Thai Phrase
            </Button>
          </Link>
        </div>
      </div>

      {/* View Site */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-medium">View Public Site</h3>
            <p className="text-sm text-muted-foreground">
              See how your guidebook looks to guests
            </p>
          </div>
          <Link href="/" target="_blank">
            <Button variant="outline">Open Site</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
