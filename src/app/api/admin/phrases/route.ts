import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const phrases = await prisma.thaiPhrase.findMany({ orderBy: { category: "asc" } });
    return NextResponse.json(phrases);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phrase = await prisma.thaiPhrase.create({
      data: { english: body.english, thai: body.thai, pronunciation: body.pronunciation, category: body.category },
    });
    return NextResponse.json(phrase, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
