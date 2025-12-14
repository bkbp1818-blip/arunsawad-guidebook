"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  slug: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  endTime: string | null;
  locationId: string | null;
  imageUrl: string | null;
  isActive: boolean;
  location: Location | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    locationId: "",
    imageUrl: "",
    isActive: true,
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) setEvents(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      if (res.ok) setLocations(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events";
      const res = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locationId: formData.locationId || null,
        }),
      });
      if (res.ok) {
        toast.success(editingEvent ? "Event updated!" : "Event created!");
        setIsOpen(false);
        setEditingEvent(null);
        resetForm();
        fetchEvents();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted!");
        fetchEvents();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      endTime: "",
      locationId: "",
      imageUrl: "",
      isActive: true,
    });
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      time: event.time || "",
      endTime: event.endTime || "",
      locationId: event.locationId || "",
      imageUrl: event.imageUrl || "",
      isActive: event.isActive,
    });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage hostel events and activities</p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingEvent(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={formData.locationId}
                    onValueChange={(v) => setFormData({ ...formData, locationId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  {editingEvent ? "Update" : "Create"} Event
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
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium">No events yet</h3>
            <p className="text-sm text-muted-foreground">Create your first event to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-xs font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.isActive ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          <X className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.time && `${event.time}`}
                      {event.endTime && ` - ${event.endTime}`}
                      {event.location && ` @ ${event.location.name}`}
                    </p>
                    {event.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(event.id)}>
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
