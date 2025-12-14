"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Home,
  Phone,
  Coffee,
  Send,
  MessageCircle,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  endTime: string | null;
  imageUrl: string | null;
  location: {
    name: string;
    slug: string;
  } | null;
}

interface GuestbookEntry {
  id: string;
  name: string;
  country: string | null;
  message: string;
  rating: number | null;
  createdAt: string;
}

// Calendar helper functions
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CommunityPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Guestbook form state
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    message: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch events for current month
  const fetchEvents = useCallback(async () => {
    try {
      const month = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
      const res = await fetch(`/api/events?month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, [currentMonth, currentYear]);

  // Fetch guestbook entries
  const fetchGuestbook = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook?limit=20");
      if (res.ok) {
        const data = await res.json();
        setGuestbookEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch guestbook:", error);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchGuestbook()]);
      setLoading(false);
    }
    loadData();
  }, [fetchEvents, fetchGuestbook]);

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  // Submit guestbook entry
  const handleSubmitGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitMessage({ type: "success", text: data.message });
        setFormData({ name: "", country: "", message: "", rating: 0 });
      } else {
        setSubmitMessage({ type: "error", text: data.error || "Something went wrong" });
      }
    } catch {
      setSubmitMessage({ type: "error", text: "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
          <h1 className="font-serif text-lg font-semibold">Community</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="guestbook" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Guestbook
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Calendar */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle className="font-serif text-xl">
                    {MONTHS[currentMonth]} {currentYear}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="py-2 text-center text-xs font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const dayEvents = getEventsForDate(date);
                      const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();
                      const isSelected =
                        selectedDate &&
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear();

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => setSelectedDate(date)}
                          className={`relative aspect-square rounded-lg p-1 text-sm transition-colors hover:bg-muted ${
                            isToday ? "bg-primary/10 font-bold text-primary" : ""
                          } ${isSelected ? "ring-2 ring-primary" : ""}`}
                        >
                          <span className="block">{date.getDate()}</span>
                          {dayEvents.length > 0 && (
                            <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                              {dayEvents.slice(0, 3).map((_, i) => (
                                <span
                                  key={i}
                                  className="h-1.5 w-1.5 rounded-full bg-primary"
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Events / Upcoming Events */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-semibold">
                  {selectedDate
                    ? `Events on ${selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Upcoming Events"}
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : selectedDate && selectedDateEvents.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Calendar className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No events on this day
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  (selectedDate ? selectedDateEvents : events.filter(e => new Date(e.date) >= today))
                    .slice(0, 5)
                    .map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <span className="text-xs font-medium">
                                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                              </span>
                              <span className="text-lg font-bold leading-none">
                                {new Date(event.date).getDate()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{event.title}</h4>
                              {event.time && (
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                  {event.endTime && ` - ${event.endTime}`}
                                </p>
                              )}
                              {event.location && (
                                <p className="flex items-center gap-1 text-sm text-primary">
                                  <MapPin className="h-3 w-3" />
                                  {event.location.name}
                                </p>
                              )}
                              {event.description && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}

                {selectedDate && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSelectedDate(null)}
                  >
                    Show all upcoming events
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Guestbook Tab */}
          <TabsContent value="guestbook">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* Guestbook Entries */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-semibold">
                  Messages from Travelers
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : guestbookEntries.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h4 className="mt-4 font-medium">No messages yet</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Be the first to leave a message!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {guestbookEntries.map((entry) => (
                      <Card key={entry.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{entry.name}</p>
                                {entry.country && (
                                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Globe className="h-3 w-3" />
                                    {entry.country}
                                  </p>
                                )}
                              </div>
                            </div>
                            {entry.rating && (
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < entry.rating!
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="mt-3 text-muted-foreground">
                            {entry.message}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Leave a Message Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Send className="h-5 w-5" />
                      Leave a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitGuestbook} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="Where are you from?"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({ ...formData, country: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  rating: formData.rating === rating ? 0 : rating,
                                })
                              }
                              className="p-1"
                            >
                              <Star
                                className={`h-6 w-6 transition-colors ${
                                  rating <= formData.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30 hover:text-yellow-400/50"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Share your experience..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                        />
                      </div>

                      {submitMessage && (
                        <div
                          className={`rounded-lg p-3 text-sm ${
                            submitMessage.type === "success"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {submitMessage.text}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
          <Link href="/community" className="flex flex-col items-center p-2 text-primary">
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
