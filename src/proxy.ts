import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(
      new URL("/login", req.nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/settings/:path*",
    "/invoices/:path*",
    "/products/:path*",
    "/payments/:path*",
  ],
};