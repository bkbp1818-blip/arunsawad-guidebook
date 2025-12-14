import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET single daily pick
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const dailyPick = await prisma.dailyPick.findUnique({
      where: { id },
      include: {
        place: {
          select: { name: true, nameThai: true },
        },
      },
    });

    if (!dailyPick) {
      return NextResponse.json({ error: "Daily pick not found" }, { status: 404 });
    }

    return NextResponse.json(dailyPick);
  } catch (error) {
    console.error("Error fetching daily pick:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update daily pick
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, placeId, isActive } = body;

    const dailyPick = await prisma.dailyPick.update({
      where: { id },
      data: {
        title,
        description: description || null,
        placeId: placeId || null,
        isActive,
      },
      include: {
        place: {
          select: { name: true, nameThai: true },
        },
      },
    });

    return NextResponse.json(dailyPick);
  } catch (error) {
    console.error("Error updating daily pick:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE daily pick
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.dailyPick.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting daily pick:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
