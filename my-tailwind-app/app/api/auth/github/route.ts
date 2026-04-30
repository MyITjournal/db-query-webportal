import { NextResponse } from "next/server";
import { BACKEND } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const portalBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(request.url).origin;

  const callbackUrl = `${portalBase}/api/auth/callback`;
  const backendOAuthUrl = `${BACKEND}/auth/github?redirect_uri=${encodeURIComponent(callbackUrl)}`;

  return NextResponse.redirect(backendOAuthUrl);
}
