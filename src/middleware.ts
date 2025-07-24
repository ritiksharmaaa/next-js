import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.SESSION_SECRET,
  });
  const url = request.nextUrl;
  // here we seee token and also url . double checking whethre token is good but how many  url it get .
  if (
    token &&
    (url.pathname.startsWith("sign-in") ||
      url.pathname.startsWith("sign-up") ||
      url.pathname.startsWith("/") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  //   matcher: '/about/:path*', ther eyou tell in which url your middleware run
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
