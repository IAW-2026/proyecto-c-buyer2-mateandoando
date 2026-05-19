import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPrivateRoute = createRouteMatcher(['/carrito(.*)', '/checkout(.*)', '/mis-compras(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}