/**
 * Security utilities for Spring Valley Church
 * - Rate limiting
 * - Input sanitization
 * - Token encryption
 */

import crypto from "crypto";

// ─── Rate Limiting (in-memory, per-IP) ──────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter.
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Login-specific rate limiter: 5 attempts per 15 minutes.
 */
export function checkLoginRateLimit(ip: string): boolean {
  return checkRateLimit(`login:${ip}`, 5, 15 * 60_000);
}

// ─── Encryption (AES-256-GCM for stored tokens) ────────────────────

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error("ENCRYPTION_KEY must be at least 32 characters");
  }
  return Buffer.from(key.slice(0, 32), "utf-8");
}

/**
 * Encrypt a string (e.g., API tokens) for safe database storage.
 * Returns "iv:encrypted:authTag" format.
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypt a string stored by encrypt().
 */
export function decrypt(encryptedText: string): string {
  const key = getEncryptionKey();
  const [ivHex, encrypted, authTagHex] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// ─── Input Sanitization ─────────────────────────────────────────────

/**
 * Strip HTML tags from a string to prevent XSS.
 */
export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength.
 * Requirements: 8+ chars, 1 uppercase, 1 number, 1 special char.
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(password))
    return {
      valid: false,
      message: "Password must contain an uppercase letter",
    };
  if (!/[0-9]/.test(password))
    return { valid: false, message: "Password must contain a number" };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    return {
      valid: false,
      message: "Password must contain a special character",
    };
  return { valid: true };
}

// ─── Security Headers ───────────────────────────────────────────────

export const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};
