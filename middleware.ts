import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CURRENT_PROJECT_COOKIE = "currentProjectId";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/project\/([^/]+)/);
  if (match) {
    const projectId = match[1];
    const response = NextResponse.next();
    response.cookies.set(CURRENT_PROJECT_COOKIE, projectId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }
  return NextResponse.next();
}
