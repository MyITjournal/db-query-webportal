import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Rotate CSRF token
  session.csrfToken = randomBytes(32).toString("hex");
  await session.save();

  return NextResponse.json({ csrfToken: session.csrfToken });
}
