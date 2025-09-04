import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_SECRET_LENGTH = 32;
const TOKEN_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

interface TokenData {
  token: string;
  timestamp: number;
}

// Generate a new CSRF token
export function generateToken(): string {
  const secret = randomBytes(CSRF_SECRET_LENGTH).toString('hex');
  const timestamp = Date.now();
  const data: TokenData = { token: secret, timestamp };
  
  // Store token in HTTP-only cookie
  cookies().set(CSRF_TOKEN_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_TIMEOUT / 1000 // Convert to seconds
  });

  // Return the hashed token to be included in forms
  return createHash('sha256').update(secret).digest('hex');
}

// Validate a CSRF token
export function validateToken(formToken: string): boolean {
  const storedData = cookies().get(CSRF_TOKEN_COOKIE);
  
  if (!storedData?.value) {
    return false;
  }

  try {
    const data: TokenData = JSON.parse(storedData.value);
    
    // Check if token has expired
    if (Date.now() - data.timestamp > TOKEN_TIMEOUT) {
      return false;
    }

    // Compare hashed tokens
    const hashedStored = createHash('sha256').update(data.token).digest('hex');
    return formToken === hashedStored;
  } catch {
    return false;
  }
}

// Middleware to protect against CSRF
export async function csrfProtection(request: Request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const formToken = request.headers.get('X-CSRF-Token');
    
    if (!formToken || !validateToken(formToken)) {
      return new Response('Invalid CSRF token', { status: 403 });
    }
  }
}