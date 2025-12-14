"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Check, X, Trash2, Star, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface GuestbookEntry {
  id: string;
  name: string;
  country: string | null;
  message: string;
  rating: number | null;
  isApproved: boolean;
  createdAt: string;
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/admin/guestbook");
      if (res.ok) setEntries(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/admin/guestbook/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });
      if (res.ok) {
        toast.success(approve ? "Entry approved!" : "Entry hidden!");
        fetchEntries();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`/api/admin/guestbook/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted!");
        fetchEntries();
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (filter === "pending") return !entry.isApproved;
    if (filter === "approved") return entry.isApproved;
    return true;
  });

  const pendingCount = entries.filter((e) => !e.isApproved).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Guestbook</h1>
          <p className="text-muted-foreground">
            Moderate guestbook entries from travelers
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({entries.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("approved")}
        >
          Approved ({entries.length - pendingCount})
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium">
              {filter === "pending" ? "No pending entries" : "No guestbook entries"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "pending"
                ? "All entries have been reviewed"
                : "Entries from travelers will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className={!entry.isApproved ? "border-yellow-500/50 bg-yellow-500/5" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.name}</span>
                          {!entry.isApproved && (
                            <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600">
                              Pending
                            </span>
                          )}
                        </div>
                        {entry.country && (
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            {entry.country}
                          </p>
                        )}
                      </div>
                    </div>

                    {entry.rating && (
                      <div className="mt-2 flex items-center gap-0.5">
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

                    <p className="mt-2 text-muted-foreground">{entry.message}</p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!entry.isApproved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:bg-green-500/10"
                        onClick={() => handleApprove(entry.id, true)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(entry.id, false)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Hide
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
