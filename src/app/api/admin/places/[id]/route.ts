import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const place = await prisma.place.update({
      where: { id },
      data: {
        name: body.name,
        nameThai: body.nameThai || null,
        description: body.description,
        address: body.address,
        category: body.category,
        timeOfDay: body.timeOfDay,
        priceRange: body.priceRange,
        mustTry: body.mustTry || null,
        tips: body.tips || null,
        isHostelChoice: body.isHostelChoice,
        locationId: body.locationId,
      },
    });
    return NextResponse.json(place);
  } catch (error) {
    console.error("Error updating place:", error);
    return NextResponse.json({ error: "Failed to update place" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.place.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting place:", error);
    return NextResponse.json({ error: "Failed to delete place" }, { status: 500 });
  }
}
