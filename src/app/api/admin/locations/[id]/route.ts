import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const location = await prisma.location.update({
      where: { id },
      data: {
        slug: body.slug,
        name: body.name,
        nameThai: body.nameThai || null,
        tagline: body.tagline || null,
        description: body.description || null,
        address: body.address,
        addressThai: body.addressThai || null,
        wifiName: body.wifiName,
        wifiPassword: body.wifiPassword,
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        emergencyPhone: body.emergencyPhone,
        breakfastInfo: body.breakfastInfo || null,
        houseRules: body.houseRules || null,
        spotifyPlaylist: body.spotifyPlaylist || null,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
