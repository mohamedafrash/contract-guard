import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listHistoryForUser } from "@/app/lib/convexHistory";

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      ({ userId } = await auth());
    } catch {
      return NextResponse.json({ history: [] });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await listHistoryForUser(userId);
    return NextResponse.json({ history });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
