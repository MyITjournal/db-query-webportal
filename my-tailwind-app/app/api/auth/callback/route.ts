import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { BACKEND } from "@/lib/api";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const error = searchParams.get("error");

  if (error || !token) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error || "auth_failed")}`,
        request.url,
      ),
    );
  }

  let user = null;
  try {
    const res = await fetch(`${BACKEND}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      user = data.user || data;
    }
  } catch {
    // /api/me not available; proceed without user metadata
  }

  const session = await getSession();
  session.token = token;
  session.refreshToken = refreshToken ?? undefined;
  session.user = user;
  session.csrfToken = randomBytes(32).toString("hex");
  await session.save();

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
