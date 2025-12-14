import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, string> = {};
    if (category && category !== "all") {
      where.category = category;
    }

    const phrases = await prisma.thaiPhrase.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { english: "asc" },
      ],
    });

    return NextResponse.json(phrases);
  } catch (error) {
    console.error("Error fetching phrases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
