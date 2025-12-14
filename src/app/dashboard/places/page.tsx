"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Utensils, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
}

interface Place {
  id: string;
  name: string;
  nameThai: string | null;
  description: string;
  category: string;
  timeOfDay: string;
  priceRange: number;
  mustTry: string | null;
  isHostelChoice: boolean;
  locationId: string;
  location: { name: string };
}

const categories = ["CAFE", "STREET_FOOD", "RESTAURANT", "BAR", "CULTURAL", "MARKET", "TRANSPORT"];
const timeOfDayOptions = ["MORNING", "DAY", "NIGHT", "ANYTIME"];

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameThai: "",
    description: "",
    address: "",
    category: "CAFE",
    timeOfDay: "ANYTIME",
    priceRange: 1,
    mustTry: "",
    tips: "",
    isHostelChoice: false,
    locationId: "",
  });

  const fetchData = async () => {
    try {
      const [placesRes, locationsRes] = await Promise.all([
        fetch("/api/admin/places"),
        fetch("/api/admin/locations"),
      ]);
      if (placesRes.ok) setPlaces(await placesRes.json());
      if (locationsRes.ok) setLocations(await locationsRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPlace
        ? `/api/admin/places/${editingPlace.id}`
        : "/api/admin/places";
      const method = editingPlace ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingPlace ? "Place updated!" : "Place created!");
        setIsOpen(false);
        setEditingPlace(null);
        resetForm();
        fetchData();
      } else {
        toast.error("Failed to save place");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/places/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Place deleted!");
        fetchData();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const openEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      nameThai: place.nameThai || "",
      description: place.description,
      address: "",
      category: place.category,
      timeOfDay: place.timeOfDay,
      priceRange: place.priceRange,
      mustTry: place.mustTry || "",
      tips: "",
      isHostelChoice: place.isHostelChoice,
      locationId: place.locationId,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameThai: "",
      description: "",
      address: "",
      category: "CAFE",
      timeOfDay: "ANYTIME",
      priceRange: 1,
      mustTry: "",
      tips: "",
      isHostelChoice: false,
      locationId: locations[0]?.id || "",
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Places</h1>
          <p className="text-muted-foreground">Manage recommended places</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) { setEditingPlace(null); resetForm(); }
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Place</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPlace ? "Edit Place" : "Add New Place"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name (Thai)</Label>
                  <input
                    value={formData.nameThai}
                    onChange={(e) => setFormData({ ...formData, nameThai: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time of Day</Label>
                  <Select value={formData.timeOfDay} onValueChange={(v) => setFormData({ ...formData, timeOfDay: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeOfDayOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={formData.locationId} onValueChange={(v) => setFormData({ ...formData, locationId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price Range (1-4)</Label>
                  <Select value={formData.priceRange.toString()} onValueChange={(v) => setFormData({ ...formData, priceRange: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((p) => <SelectItem key={p} value={p.toString()}>{"฿".repeat(p)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Must Try</Label>
                <input
                  value={formData.mustTry}
                  onChange={(e) => setFormData({ ...formData, mustTry: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g., Pad Thai, Tom Yum"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHostelChoice"
                  checked={formData.isHostelChoice}
                  onChange={(e) => setFormData({ ...formData, isHostelChoice: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isHostelChoice">Hostel&apos;s Choice (Featured)</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPlace ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-6 w-32 rounded bg-muted" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Card key={place.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{place.name}</h3>
                      <p className="text-xs text-muted-foreground">{place.nameThai}</p>
                    </div>
                  </div>
                  {place.isHostelChoice && (
                    <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  )}
                </div>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{place.description}</p>
                <div className="mb-3 flex flex-wrap gap-1">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{place.category}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{place.timeOfDay}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{place.location.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(place)}>
                    <Pencil className="mr-1 h-3 w-3" />Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(place.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
