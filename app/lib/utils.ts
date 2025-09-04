import { createClient } from '@/lib/supabase/server';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_ATTEMPTS = 5;

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  // Reset if outside window
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  // Increment attempts
  entry.attempts++;
  rateLimitStore.set(identifier, entry);

  return entry.attempts > MAX_ATTEMPTS;
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*)' };
  }

  return { isValid: true };
}