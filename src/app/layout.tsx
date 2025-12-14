import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "ARUN SA WAD | Local Guidebook",
  description: "Your curated guide to Bangkok's hidden gems. Discover the best local spots around our boutique hostels in Chinatown, Yaowarat, and Soi Nana.",
  keywords: ["Bangkok", "Hostel", "Guidebook", "Chinatown", "Yaowarat", "Travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
