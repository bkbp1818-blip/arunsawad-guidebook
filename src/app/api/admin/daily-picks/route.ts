import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all daily picks
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dailyPicks = await prisma.dailyPick.findMany({
      include: {
        place: {
          select: { name: true, nameThai: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(dailyPicks);
  } catch (error) {
    console.error("Error fetching daily picks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create daily pick
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, placeId, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const dailyPick = await prisma.dailyPick.create({
      data: {
        title,
        description: description || null,
        placeId: placeId || null,
        isActive: isActive ?? true,
      },
      include: {
        place: {
          select: { name: true, nameThai: true },
        },
      },
    });

    return NextResponse.json(dailyPick, { status: 201 });
  } catch (error) {
    console.error("Error creating daily pick:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
