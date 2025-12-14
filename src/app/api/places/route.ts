import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationSlug = searchParams.get("location");
    const category = searchParams.get("category");
    const timeOfDay = searchParams.get("timeOfDay");

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (locationSlug) {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
        select: { id: true },
      });
      if (location) {
        where.locationId = location.id;
      }
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (timeOfDay && timeOfDay !== "all") {
      where.timeOfDay = timeOfDay;
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: [
        { isHostelChoice: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
