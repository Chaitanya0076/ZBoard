import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
    "/onboard(/.*)?",
    "/organizations(/.*)?",
    "/projects(/.*)?",
    "/issues(/.*)?",
]);
export default clerkMiddleware(async (auth, req) => {
    const authObject = await auth();
    if (!authObject.userId && isProtectedRoutes(req)) {
        return authObject.redirectToSignIn();
    }
    if(authObject.userId && !authObject.orgId && req.nextUrl.pathname !== "/onboard" && req.nextUrl.pathname !== "/"){
        return NextResponse.redirect(new URL("/onboard", req.nextUrl).toString());
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};