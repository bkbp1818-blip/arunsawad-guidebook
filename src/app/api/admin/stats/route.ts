import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [locations, places, faqs, phrases] = await Promise.all([
      prisma.location.count(),
      prisma.place.count(),
      prisma.fAQ.count(),
      prisma.thaiPhrase.count(),
    ]);

    return NextResponse.json({
      locations,
      places,
      faqs,
      phrases,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
