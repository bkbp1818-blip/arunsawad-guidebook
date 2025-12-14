import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all guestbook entries (including unapproved)
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
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
