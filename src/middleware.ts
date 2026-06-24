import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export const config = {
  matcher: ["/app/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("cb_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const session = await verifySession(token);
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("cb_session");
    return response;
  }
  return NextResponse.next();
}
