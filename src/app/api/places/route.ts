import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationSlug = searchParams.get("location");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const timeOfDay = searchParams.get("timeOfDay");
    const smartFilter = searchParams.get("filter"); // Eat, Drink, See, Shop

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (locationSlug && locationSlug !== "all") {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
        select: { id: true },
      });
      if (location) {
        where.locationId = location.id;
      }
    }

    // Smart filter mapping
    if (smartFilter && smartFilter !== "all") {
      switch (smartFilter) {
        case "eat":
          where.category = { in: ["STREET_FOOD", "RESTAURANT", "CAFE"] };
          break;
        case "drink":
          where.category = "BAR";
          break;
        case "see":
          where.category = "CULTURAL";
          break;
        case "shop":
          where.category = "MARKET";
          break;
      }
    } else if (category && category !== "all") {
      where.category = category;
    }

    if (subcategory && subcategory !== "all") {
      where.subcategory = subcategory;
    }

    if (timeOfDay && timeOfDay !== "all") {
      where.timeOfDay = timeOfDay;
    }

    const places = await prisma.place.findMany({
      where,
      include: {
        location: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
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
