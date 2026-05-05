import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionUser {
  id: string | number;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
  role?: string;
}

export interface SessionData {
  token?: string;
  refreshToken?: string;
  user?: SessionUser;
  csrfToken?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "insighta_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getSessionFromResponse(
  request: Request,
  response: Response,
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(request, response, sessionOptions);
}
