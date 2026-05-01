import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Validate CSRF token
  const csrfHeader = request.headers.get("x-csrf-token");
  const session = await getSession();

  if (!session.csrfToken || session.csrfToken !== csrfHeader) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  await session.destroy();
  return NextResponse.json({ ok: true });
}
