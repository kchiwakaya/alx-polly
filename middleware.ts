import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware';
import { csrfProtection } from '@/lib/csrf';

export async function middleware(request: NextRequest) {
  // Check CSRF token for non-GET requests
  const csrfResult = await csrfProtection(request);
  if (csrfResult) return csrfResult;

  // Update Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|register|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}