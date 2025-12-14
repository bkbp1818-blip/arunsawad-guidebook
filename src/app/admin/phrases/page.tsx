"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Phrase {
  id: string;
  english: string;
  thai: string;
  pronunciation: string;
  category: string;
}

const categories = ["greeting", "food", "numbers", "emergency"];

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null);
  const [formData, setFormData] = useState({ english: "", thai: "", pronunciation: "", category: "greeting" });

  const fetchPhrases = async () => {
    try {
      const res = await fetch("/api/admin/phrases");
      if (res.ok) setPhrases(await res.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPhrases(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPhrase ? `/api/admin/phrases/${editingPhrase.id}` : "/api/admin/phrases";
      const res = await fetch(url, {
        method: editingPhrase ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(editingPhrase ? "Phrase updated!" : "Phrase created!");
        setIsOpen(false); setEditingPhrase(null);
        setFormData({ english: "", thai: "", pronunciation: "", category: "greeting" });
        fetchPhrases();
      }
    } catch { toast.error("An error occurred"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/phrases/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Phrase deleted!"); fetchPhrases(); }
    } catch { toast.error("An error occurred"); }
  };

  const openEdit = (phrase: Phrase) => {
    setEditingPhrase(phrase);
    setFormData({ english: phrase.english, thai: phrase.thai, pronunciation: phrase.pronunciation, category: phrase.category });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Thai Phrases</h1>
          <p className="text-muted-foreground">Manage Thai phrases for guests</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) { setEditingPhrase(null); setFormData({ english: "", thai: "", pronunciation: "", category: "greeting" }); }
        }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Phrase</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{editingPhrase ? "Edit Phrase" : "Add New Phrase"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>English</Label>
                <input value={formData.english} onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required placeholder="Hello" />
              </div>
              <div className="space-y-2">
                <Label>Thai</Label>
                <input value={formData.thai} onChange={(e) => setFormData({ ...formData, thai: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required placeholder="สวัสดี" />
              </div>
              <div className="space-y-2">
                <Label>Pronunciation</Label>
                <input value={formData.pronunciation} onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required placeholder="sa-wat-dee" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPhrase ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><CardContent className="p-4"><div className="h-6 w-32 rounded bg-muted" /></CardContent></Card>)}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phrases.map((phrase) => (
            <Card key={phrase.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{phrase.english}</p>
                      <p className="text-xl font-semibold text-primary">{phrase.thai}</p>
                      <p className="text-sm italic text-muted-foreground">{phrase.pronunciation}</p>
                      <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 text-xs">{phrase.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(phrase)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(phrase.id)}><Trash2 className="h-3 w-3" /></Button>
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
