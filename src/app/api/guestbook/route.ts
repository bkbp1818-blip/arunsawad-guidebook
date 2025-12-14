import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET approved guestbook entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const entries = await prisma.guestbookEntry.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new guestbook entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, country, message, rating } = body;

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create entry (not approved by default)
    const entry = await prisma.guestbookEntry.create({
      data: {
        name: name.trim(),
        country: country?.trim() || null,
        message: message.trim(),
        rating: rating || null,
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! It will appear after review.",
      entry,
    });
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
