import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

const publicRoutes = ['/sign-in', '/sign-up'];
const protectedRoutes = ['/dashboard'];

export default clerkMiddleware(async (auth, request: NextRequest) => {
   const { userId } = await auth();
   const url = request.nextUrl;

   if (!userId && protectedRoutes.includes(url.pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
   }

   if (userId && publicRoutes.includes(url.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
   }

   return NextResponse.next();
});

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
   ],
};
