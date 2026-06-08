import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/register/patient", "/register/doctor"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Not logged in — redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in — redirect away from public routes
  if (token && pathname === "/login") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "DOCTOR") return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }

  // Role based protection
  if (token && pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname.startsWith("/doctor") && role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname.startsWith("/patient") && role !== "PATIENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};