"use client";

import { useEffect, useState } from "react";
import {
  HandMetal,
  Utensils,
  Hash,
  AlertTriangle,
  Volume2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ThaiPhrase {
  id: string;
  english: string;
  thai: string;
  pronunciation: string;
  category: string;
}

const categoryConfig: Record<string, { icon: typeof HandMetal; label: string; color: string }> = {
  greeting: { icon: HandMetal, label: "Greetings", color: "bg-blue-500/10 text-blue-600" },
  food: { icon: Utensils, label: "Food", color: "bg-orange-500/10 text-orange-600" },
  numbers: { icon: Hash, label: "Numbers", color: "bg-green-500/10 text-green-600" },
  emergency: { icon: AlertTriangle, label: "Emergency", color: "bg-red-500/10 text-red-600" },
};

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<ThaiPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhrases() {
      try {
        const res = await fetch("/api/phrases");
        if (res.ok) {
          const data = await res.json();
          setPhrases(data);
        }
      } catch (error) {
        console.error("Failed to fetch phrases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhrases();
  }, []);

  const copyThai = (phrase: ThaiPhrase) => {
    navigator.clipboard.writeText(phrase.thai);
    setCopiedId(phrase.id);
    toast.success(`Copied: ${phrase.thai}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakThai = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "th-TH";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported");
    }
  };

  const categories = Object.keys(categoryConfig);

  const getPhrasesByCategory = (category: string) => {
    return phrases.filter((p) => p.category === category);
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
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Basic Thai Phrases
        </h2>
        <p className="mt-1 text-muted-foreground">
          Essential words to help you navigate Bangkok
        </p>
      </div>

      {/* Tip */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-foreground">
            <span className="font-medium">💡 Tip:</span> Add{" "}
            <span className="font-medium text-primary">ครับ (krap)</span> if you&apos;re male or{" "}
            <span className="font-medium text-primary">ค่ะ (ka)</span> if you&apos;re female at the end of sentences to be polite!
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="greeting" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const Icon = config.icon;
            return (
              <TabsTrigger key={cat} value={cat} className="gap-1 text-xs sm:text-sm">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const config = categoryConfig[cat];
          const categoryPhrases = getPhrasesByCategory(cat);

          return (
            <TabsContent key={cat} value={cat}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-serif text-lg">
                    <config.icon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
                    {config.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryPhrases.map((phrase) => (
                    <div
                      key={phrase.id}
                      className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {phrase.english}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-primary">
                          {phrase.thai}
                        </p>
                        <p className="mt-1 text-sm italic text-muted-foreground">
                          {phrase.pronunciation}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => speakThai(phrase.thai)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => copyThai(phrase)}
                        >
                          {copiedId === phrase.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {categoryPhrases.length === 0 && (
                    <p className="py-8 text-center text-muted-foreground">
                      No phrases in this category yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* All Phrases Quick Reference */}
      <div className="mt-8">
        <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
          Quick Reference
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phrases.slice(0, 9).map((phrase) => (
            <Card
              key={phrase.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => speakThai(phrase.thai)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{phrase.english}</p>
                    <p className="text-lg font-semibold text-primary">{phrase.thai}</p>
                  </div>
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
