"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Coffee,
  Utensils,
  Wine,
  Landmark,
  ShoppingBag,
  Bus,
  Sun,
  Sunset,
  Moon,
  Clock,
  Star,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Place {
  id: string;
  name: string;
  nameThai: string | null;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  timeOfDay: string;
  tags: string[];
  priceRange: number;
  mustTry: string | null;
  tips: string | null;
  googleMapsUrl: string | null;
  isHostelChoice: boolean;
}

const categoryConfig: Record<string, { icon: typeof Coffee; label: string; color: string }> = {
  CAFE: { icon: Coffee, label: "Cafe", color: "bg-amber-500/10 text-amber-600" },
  STREET_FOOD: { icon: Utensils, label: "Street Food", color: "bg-orange-500/10 text-orange-600" },
  RESTAURANT: { icon: Utensils, label: "Restaurant", color: "bg-red-500/10 text-red-600" },
  BAR: { icon: Wine, label: "Bar", color: "bg-purple-500/10 text-purple-600" },
  CULTURAL: { icon: Landmark, label: "Cultural", color: "bg-blue-500/10 text-blue-600" },
  MARKET: { icon: ShoppingBag, label: "Market", color: "bg-green-500/10 text-green-600" },
  TRANSPORT: { icon: Bus, label: "Transport", color: "bg-gray-500/10 text-gray-600" },
};

const timeConfig: Record<string, { icon: typeof Sun; label: string; color: string }> = {
  MORNING: { icon: Sun, label: "Morning", color: "bg-yellow-500/10 text-yellow-600" },
  DAY: { icon: Sunset, label: "Day", color: "bg-orange-500/10 text-orange-600" },
  NIGHT: { icon: Moon, label: "Night", color: "bg-indigo-500/10 text-indigo-600" },
  ANYTIME: { icon: Clock, label: "Anytime", color: "bg-gray-500/10 text-gray-600" },
};

export default function ExplorePage() {
  const params = useParams();
  const slug = params.location as string;
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const res = await fetch(`/api/places?location=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPlaces(data);
        }
      } catch (error) {
        console.error("Failed to fetch places:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, [slug]);

  const filteredPlaces = places.filter((place) => {
    const timeMatch = selectedTime === "all" || place.timeOfDay === selectedTime;
    const categoryMatch = selectedCategory === "all" || place.category === selectedCategory;
    return timeMatch && categoryMatch;
  });

  const openGoogleMaps = (place: Place) => {
    const url = place.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Explore Nearby
        </h2>
        <p className="mt-1 text-muted-foreground">
          Curated spots handpicked by locals
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        {/* Time Filter */}
        <div className="flex-1">
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time of Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times</SelectItem>
              <SelectItem value="MORNING">
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> Morning
                </span>
              </SelectItem>
              <SelectItem value="DAY">
                <span className="flex items-center gap-2">
                  <Sunset className="h-4 w-4" /> Day
                </span>
              </SelectItem>
              <SelectItem value="NIGHT">
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Night
                </span>
              </SelectItem>
              <SelectItem value="ANYTIME">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Anytime
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="CAFE">Cafe</SelectItem>
              <SelectItem value="STREET_FOOD">Street Food</SelectItem>
              <SelectItem value="RESTAURANT">Restaurant</SelectItem>
              <SelectItem value="BAR">Bar</SelectItem>
              <SelectItem value="CULTURAL">Cultural</SelectItem>
              <SelectItem value="MARKET">Market</SelectItem>
              <SelectItem value="TRANSPORT">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Time Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(timeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = selectedTime === key;
          return (
            <Button
              key={key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTime(isActive ? "all" : key)}
              className={isActive ? "" : config.color}
            >
              <Icon className="mr-1 h-4 w-4" />
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredPlaces.length} place{filteredPlaces.length !== 1 ? "s" : ""}
      </p>

      {/* Places Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.map((place) => {
          const category = categoryConfig[place.category] || categoryConfig.CAFE;
          const time = timeConfig[place.timeOfDay] || timeConfig.ANYTIME;
          const Icon = category.icon;
          const TimeIcon = time.icon;

          return (
            <Card
              key={place.id}
              className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              onClick={() => openGoogleMaps(place)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    {place.isHostelChoice && (
                      <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium">
                        <Star className="h-3 w-3 fill-current" />
                        Choice
                      </div>
                    )}
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${time.color}`}>
                      <TimeIcon className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-medium text-foreground">{place.name}</h3>
                {place.nameThai && (
                  <p className="text-sm text-muted-foreground">{place.nameThai}</p>
                )}

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {place.description}
                </p>

                {/* Must Try */}
                {place.mustTry && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium text-primary">Must try:</span>{" "}
                    <span className="text-muted-foreground">{place.mustTry}</span>
                  </p>
                )}

                {/* Tips */}
                {place.tips && (
                  <p className="mt-1 text-xs italic text-muted-foreground">
                    💡 {place.tips}
                  </p>
                )}

                {/* Price & Tags */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {place.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {"฿".repeat(place.priceRange)}
                    <span className="text-muted-foreground/30">
                      {"฿".repeat(4 - place.priceRange)}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                  <ExternalLink className="h-3 w-3" />
                  <span>Open in Google Maps</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-serif text-lg font-medium text-foreground">
            No places found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedTime("all");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
