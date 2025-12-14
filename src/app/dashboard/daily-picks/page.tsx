"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Place {
  id: string;
  name: string;
  nameThai: string | null;
}

interface DailyPick {
  id: string;
  title: string;
  description: string | null;
  placeId: string | null;
  isActive: boolean;
  createdAt: string;
  place: Place | null;
}

export default function DailyPicksPage() {
  const [dailyPicks, setDailyPicks] = useState<DailyPick[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPick, setEditingPick] = useState<DailyPick | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    placeId: "",
    isActive: true,
  });

  const fetchDailyPicks = async () => {
    try {
      const res = await fetch("/api/admin/daily-picks");
      if (res.ok) setDailyPicks(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await fetch("/api/places");
      if (res.ok) setPlaces(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDailyPicks();
    fetchPlaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPick ? `/api/admin/daily-picks/${editingPick.id}` : "/api/admin/daily-picks";
      const res = await fetch(url, {
        method: editingPick ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          placeId: formData.placeId || null,
        }),
      });
      if (res.ok) {
        toast.success(editingPick ? "Daily pick updated!" : "Daily pick created!");
        setIsOpen(false);
        setEditingPick(null);
        resetForm();
        fetchDailyPicks();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this daily pick?")) return;
    try {
      const res = await fetch(`/api/admin/daily-picks/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Daily pick deleted!");
        fetchDailyPicks();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      placeId: "",
      isActive: true,
    });
  };

  const openEdit = (pick: DailyPick) => {
    setEditingPick(pick);
    setFormData({
      title: pick.title,
      description: pick.description || "",
      placeId: pick.placeId || "",
      isActive: pick.isActive,
    });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Daily Picks</h1>
          <p className="text-muted-foreground">Highlight special recommendations for today</p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingPick(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Pick
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPick ? "Edit Daily Pick" : "Add New Daily Pick"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Night Market is Open Tonight!"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Link to Place (optional)</Label>
                <Select
                  value={formData.placeId}
                  onValueChange={(v) => setFormData({ ...formData, placeId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a place" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No linked place</SelectItem>
                    {places.map((place) => (
                      <SelectItem key={place.id} value={place.id}>
                        {place.name} {place.nameThai && `(${place.nameThai})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Active (show on homepage)</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  {editingPick ? "Update" : "Create"} Pick
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : dailyPicks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium">No daily picks yet</h3>
            <p className="text-sm text-muted-foreground">Create your first daily pick to highlight on the homepage</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dailyPicks.map((pick) => (
            <Card key={pick.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{pick.title}</h3>
                      {pick.isActive ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          <X className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </div>
                    {pick.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {pick.description}
                      </p>
                    )}
                    {pick.place && (
                      <p className="text-sm text-primary">
                        Linked to: {pick.place.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(pick.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(pick)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(pick.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
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
