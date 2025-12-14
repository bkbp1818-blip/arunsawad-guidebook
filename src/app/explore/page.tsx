"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Coffee,
  Utensils,
  Wine,
  Landmark,
  ShoppingBag,
  Sun,
  Sunset,
  Moon,
  Clock,
  Star,
  ExternalLink,
  Navigation,
  Home,
  Phone,
  ChevronLeft,
  Search,
  Map,
  List,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dynamic import for Google Maps (client-side only)
const PlacesMap = dynamic(() => import("@/components/places-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

interface Location {
  name: string;
  slug: string;
}

interface Place {
  id: string;
  name: string;
  nameThai: string | null;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  subcategory: string | null;
  timeOfDay: string;
  tags: string[];
  priceRange: number;
  mustTry: string | null;
  tips: string | null;
  googleMapsUrl: string | null;
  isHostelChoice: boolean;
  location: Location;
}

// Smart Filter Config (Main Categories)
const smartFilters = [
  {
    key: "all",
    label: "All",
    icon: MapPin,
    color: "bg-muted text-foreground",
    activeColor: "bg-primary text-primary-foreground",
  },
  {
    key: "eat",
    label: "Eat",
    icon: Utensils,
    emoji: "🥢",
    color: "bg-orange-500/10 text-orange-600",
    activeColor: "bg-orange-500 text-white",
  },
  {
    key: "drink",
    label: "Drink",
    icon: Wine,
    emoji: "🍺",
    color: "bg-purple-500/10 text-purple-600",
    activeColor: "bg-purple-500 text-white",
  },
  {
    key: "see",
    label: "See",
    icon: Landmark,
    emoji: "📷",
    color: "bg-blue-500/10 text-blue-600",
    activeColor: "bg-blue-500 text-white",
  },
  {
    key: "shop",
    label: "Shop",
    icon: ShoppingBag,
    emoji: "🛒",
    color: "bg-green-500/10 text-green-600",
    activeColor: "bg-green-500 text-white",
  },
];

const categoryConfig: Record<string, { icon: typeof Coffee; label: string; color: string }> = {
  CAFE: { icon: Coffee, label: "Cafe", color: "bg-amber-500/10 text-amber-600" },
  STREET_FOOD: { icon: Utensils, label: "Street Food", color: "bg-orange-500/10 text-orange-600" },
  RESTAURANT: { icon: Utensils, label: "Restaurant", color: "bg-red-500/10 text-red-600" },
  BAR: { icon: Wine, label: "Bar", color: "bg-purple-500/10 text-purple-600" },
  CULTURAL: { icon: Landmark, label: "Cultural", color: "bg-blue-500/10 text-blue-600" },
  MARKET: { icon: ShoppingBag, label: "Market", color: "bg-green-500/10 text-green-600" },
};

const timeConfig: Record<string, { icon: typeof Sun; label: string; color: string }> = {
  MORNING: { icon: Sun, label: "Morning", color: "bg-yellow-500/10 text-yellow-600" },
  DAY: { icon: Sunset, label: "Day", color: "bg-orange-500/10 text-orange-600" },
  NIGHT: { icon: Moon, label: "Night", color: "bg-indigo-500/10 text-indigo-600" },
  ANYTIME: { icon: Clock, label: "Anytime", color: "bg-gray-500/10 text-gray-600" },
};

// Subcategory options for each smart filter
const subcategoryOptions: Record<string, { key: string; label: string }[]> = {
  eat: [
    { key: "all", label: "All Food" },
    { key: "street_food", label: "Street Food" },
    { key: "local_restaurant", label: "Local Restaurant" },
    { key: "cafe", label: "Cafe" },
    { key: "dessert", label: "Dessert" },
  ],
  drink: [
    { key: "all", label: "All Bars" },
    { key: "rooftop_bar", label: "Rooftop Bar" },
    { key: "hidden_bar", label: "Hidden Bar" },
    { key: "craft_beer", label: "Craft Beer" },
    { key: "wine_bar", label: "Wine Bar" },
  ],
  see: [
    { key: "all", label: "All Spots" },
    { key: "temple", label: "Temple" },
    { key: "instagram_spot", label: "Instagram Spot" },
    { key: "street_art", label: "Street Art" },
    { key: "museum", label: "Museum" },
  ],
  shop: [
    { key: "all", label: "All Shops" },
    { key: "night_market", label: "Night Market" },
    { key: "souvenir", label: "Souvenirs" },
    { key: "wholesale", label: "Wholesale" },
  ],
};

export default function ExplorePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [locations, setLocations] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations");
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    }
    fetchLocations();
  }, []);

  // Fetch places
  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFilter !== "all") params.set("filter", selectedFilter);
      if (selectedLocation !== "all") params.set("location", selectedLocation);
      if (selectedSubcategory !== "all") params.set("subcategory", selectedSubcategory);
      if (selectedTime !== "all") params.set("timeOfDay", selectedTime);

      const res = await fetch(`/api/places?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPlaces(data);
      }
    } catch (error) {
      console.error("Failed to fetch places:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, selectedLocation, selectedSubcategory, selectedTime]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Reset subcategory when filter changes
  useEffect(() => {
    setSelectedSubcategory("all");
  }, [selectedFilter]);

  // Filter by search query (client-side)
  const filteredPlaces = places.filter((place) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      place.name.toLowerCase().includes(query) ||
      (place.nameThai && place.nameThai.toLowerCase().includes(query)) ||
      place.description.toLowerCase().includes(query) ||
      place.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const openGoogleMaps = (place: Place) => {
    const url = place.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  const getDirections = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-serif text-lg font-semibold">Explore Nearby</h1>
          </div>
          {/* View Toggle */}
          <div className="flex rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4">
        {/* Smart Filters - Big Buttons */}
        <section className="mb-4">
          <div className="grid grid-cols-5 gap-2">
            {smartFilters.map((filter) => {
              const isActive = selectedFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                    isActive ? filter.activeColor : filter.color
                  }`}
                >
                  {filter.emoji ? (
                    <span className="text-xl">{filter.emoji}</span>
                  ) : (
                    <filter.icon className="h-5 w-5" />
                  )}
                  <span className="text-xs font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Subcategory Pills (show when smart filter is selected) */}
        {selectedFilter !== "all" && subcategoryOptions[selectedFilter] && (
          <section className="mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {subcategoryOptions[selectedFilter].map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setSelectedSubcategory(sub.key)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-all ${
                    selectedSubcategory === sub.key
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Search & Filters */}
        <section className="mb-4 flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.slug}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Filter */}
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times</SelectItem>
              {Object.entries(timeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {loading ? "Loading..." : `${filteredPlaces.length} place${filteredPlaces.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="mb-4 h-[60vh] overflow-hidden rounded-xl border border-border">
            {loading ? (
              <div className="flex h-full items-center justify-center bg-muted">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <PlacesMap
                places={filteredPlaces}
                onPlaceClick={(place) => setSelectedPlace(place)}
              />
            )}
          </div>
        )}

        {/* List View - Places Grid */}
        {viewMode === "list" && (
          <>
            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlaces.map((place) => {
                  const category = categoryConfig[place.category] || categoryConfig.CAFE;
                  const time = timeConfig[place.timeOfDay] || timeConfig.ANYTIME;
                  const Icon = category.icon;
                  const TimeIcon = time.icon;

                  return (
                    <Card
                      key={place.id}
                      className="cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
                      onClick={() => setSelectedPlace(place)}
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
                                Pick
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

                        {/* Location Badge */}
                        {place.location && (
                          <p className="mt-1 text-xs text-primary">
                            @ {place.location.name}
                          </p>
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredPlaces.length === 0 && (
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
                setSelectedFilter("all");
                setSelectedLocation("all");
                setSelectedSubcategory("all");
                setSelectedTime("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Place Detail Modal */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selectedPlace && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="font-serif text-xl">
                      {selectedPlace.name}
                    </DialogTitle>
                    {selectedPlace.nameThai && (
                      <p className="text-sm text-muted-foreground">
                        {selectedPlace.nameThai}
                      </p>
                    )}
                  </div>
                  {selectedPlace.isHostelChoice && (
                    <div className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-current" />
                      Hostel Pick
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Category & Time Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm ${categoryConfig[selectedPlace.category]?.color || "bg-muted"}`}>
                    {categoryConfig[selectedPlace.category]?.label || selectedPlace.category}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-sm ${timeConfig[selectedPlace.timeOfDay]?.color || "bg-muted"}`}>
                    {timeConfig[selectedPlace.timeOfDay]?.label || selectedPlace.timeOfDay}
                  </span>
                  {selectedPlace.location && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                      @ {selectedPlace.location.name}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{selectedPlace.description}</p>

                {/* Must Try */}
                {selectedPlace.mustTry && (
                  <div className="rounded-lg bg-accent/10 p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-primary">🌟 Must Try:</span>{" "}
                      {selectedPlace.mustTry}
                    </p>
                  </div>
                )}

                {/* Tips */}
                {selectedPlace.tips && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      <span className="font-semibold">💡 Hostel&apos;s Tip:</span>{" "}
                      {selectedPlace.tips}
                    </p>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{selectedPlace.address}</p>
                </div>

                {/* Price & Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {selectedPlace.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-medium">
                    {"฿".repeat(selectedPlace.priceRange)}
                    <span className="text-muted-foreground/30">
                      {"฿".repeat(4 - selectedPlace.priceRange)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => getDirections(selectedPlace)}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openGoogleMaps(selectedPlace)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-around p-2">
          <Link href="/" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center p-2 text-primary">
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
