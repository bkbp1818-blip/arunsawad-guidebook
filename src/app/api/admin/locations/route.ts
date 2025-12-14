import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const location = await prisma.location.create({
      data: {
        slug: body.slug,
        name: body.name,
        nameThai: body.nameThai || null,
        tagline: body.tagline || null,
        description: body.description || null,
        address: body.address,
        addressThai: body.addressThai || null,
        latitude: body.latitude || 0,
        longitude: body.longitude || 0,
        wifiName: body.wifiName,
        wifiPassword: body.wifiPassword,
        checkInTime: body.checkInTime || "14:00",
        checkOutTime: body.checkOutTime || "12:00",
        emergencyPhone: body.emergencyPhone,
        breakfastInfo: body.breakfastInfo || null,
        houseRules: body.houseRules || null,
        spotifyPlaylist: body.spotifyPlaylist || null,
      },
    });
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
