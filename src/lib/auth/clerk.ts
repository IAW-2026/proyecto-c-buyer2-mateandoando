// Placeholder for Clerk helpers and server-side auth utilities
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  secretKey: process.env.CLERK_SECRET_KEY || ''
}

export function isServiceTokenValid(token?: string, expected?: string) {
  if (!token || !expected) return false
  return token === expected
}
