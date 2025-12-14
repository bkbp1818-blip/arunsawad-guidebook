import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");
    const month = searchParams.get("month"); // YYYY-MM format
    const locationSlug = searchParams.get("location");

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    // Only show upcoming events
    if (upcoming === "true") {
      where.date = { gte: new Date() };
    }

    // Filter by month
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Filter by location
    if (locationSlug && locationSlug !== "all") {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
        select: { id: true },
      });
      if (location) {
        where.locationId = location.id;
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        location: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
