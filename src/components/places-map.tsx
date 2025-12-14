"use client";

import { useCallback, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Coffee, Utensils, Wine, Landmark, ShoppingBag, Bus, Star, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface PlacesMapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Bangkok Chinatown center
const defaultCenter = {
  lat: 13.7420,
  lng: 100.5107,
};

// Map style - subtle and modern
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

// Category colors for markers
const categoryColors: Record<string, string> = {
  CAFE: "#f59e0b",      // amber
  STREET_FOOD: "#f97316", // orange
  RESTAURANT: "#ef4444",  // red
  BAR: "#a855f7",         // purple
  CULTURAL: "#3b82f6",    // blue
  MARKET: "#22c55e",      // green
  TRANSPORT: "#6b7280",   // gray
};

const categoryIcons: Record<string, typeof Coffee> = {
  CAFE: Coffee,
  STREET_FOOD: Utensils,
  RESTAURANT: Utensils,
  BAR: Wine,
  CULTURAL: Landmark,
  MARKET: ShoppingBag,
  TRANSPORT: Bus,
};

export default function PlacesMap({ places, onPlaceClick }: PlacesMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate bounds to fit all markers
  const bounds = useMemo(() => {
    if (!places.length) return null;
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      bounds.extend({ lat: place.latitude, lng: place.longitude });
    });
    return bounds;
  }, [places]);

  // Fit bounds when places change
  useMemo(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, bounds]);

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const openGoogleMaps = (place: Place) => {
    const url = place.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  const getDirections = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">Failed to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {places.map((place) => {
        const color = categoryColors[place.category] || "#6b7280";

        return (
          <MarkerF
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            onClick={() => handleMarkerClick(place)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: place.isHostelChoice ? 12 : 10,
            }}
          />
        );
      })}

      {selectedPlace && (
        <InfoWindowF
          position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="max-w-[280px] p-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-foreground">{selectedPlace.name}</h3>
                {selectedPlace.nameThai && (
                  <p className="text-sm text-muted-foreground">{selectedPlace.nameThai}</p>
                )}
              </div>
              {selectedPlace.isHostelChoice && (
                <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs">
                  <Star className="h-3 w-3 fill-current" />
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {selectedPlace.description}
            </p>

            {selectedPlace.mustTry && (
              <p className="mt-2 text-sm">
                <span className="font-medium text-primary">Must try:</span>{" "}
                <span className="text-muted-foreground">{selectedPlace.mustTry}</span>
              </p>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {"฿".repeat(selectedPlace.priceRange)}
                <span className="opacity-30">{"฿".repeat(4 - selectedPlace.priceRange)}</span>
              </span>
              <span className="text-xs text-primary">@ {selectedPlace.location.name}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => getDirections(selectedPlace)}
              >
                <Navigation className="mr-1 h-3 w-3" />
                Directions
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => {
                  if (onPlaceClick) {
                    onPlaceClick(selectedPlace);
                    setSelectedPlace(null);
                  } else {
                    openGoogleMaps(selectedPlace);
                  }
                }}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Details
              </Button>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
