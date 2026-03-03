import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const THEME_COOKIE = "theme";

export async function POST(request: Request) {
  const body = await request.json();
  const theme = body.theme as string;
  if (theme !== "light" && theme !== "dark" && theme !== "system") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return NextResponse.json({ ok: true });
}
