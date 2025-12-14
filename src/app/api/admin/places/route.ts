import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: { location: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const place = await prisma.place.create({
      data: {
        name: body.name,
        nameThai: body.nameThai || null,
        description: body.description,
        address: body.address,
        latitude: body.latitude || 0,
        longitude: body.longitude || 0,
        category: body.category,
        timeOfDay: body.timeOfDay,
        tags: body.tags || [],
        priceRange: body.priceRange || 1,
        mustTry: body.mustTry || null,
        tips: body.tips || null,
        isHostelChoice: body.isHostelChoice || false,
        locationId: body.locationId,
      },
    });
    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error("Error creating place:", error);
    return NextResponse.json({ error: "Failed to create place" }, { status: 500 });
  }
}
