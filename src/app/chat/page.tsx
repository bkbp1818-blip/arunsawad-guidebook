"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  Wifi,
  Utensils,
  MapPin,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  { icon: Wifi, text: "What's the WiFi password?", color: "bg-blue-500/10 text-blue-600" },
  { icon: Utensils, text: "Best street food nearby?", color: "bg-orange-500/10 text-orange-600" },
  { icon: MapPin, text: "How do I get to Grand Palace?", color: "bg-green-500/10 text-green-600" },
  { icon: Clock, text: "What time is check-out?", color: "bg-purple-500/10 text-purple-600" },
  { icon: HelpCircle, text: "Any tips for bargaining?", color: "bg-pink-500/10 text-pink-600" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: assistantContent }
                : m
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again! 🙏",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl">
                🐉
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold text-foreground">
                  Chao
                </h1>
                <p className="text-xs text-muted-foreground">เจ้าสัว • Your local guide</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Online
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl">
                    🐉
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    สวัสดีครับ! I&apos;m Chao 🐉
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Your friendly local guide for Chinatown. Ask me anything about
                    food, directions, local tips, or hostel information!
                  </p>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <div>
                <p className="mb-3 text-center text-sm text-muted-foreground">
                  Quick questions
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {quickQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={`${q.color} border-0`}
                      onClick={() => handleQuickQuestion(q.text)}
                    >
                      <q.icon className="mr-1 h-4 w-4" />
                      {q.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm">🐉</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Chao
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
                  <span className="text-sm">🐉</span>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Chao anything..."
                className="w-full rounded-full border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
