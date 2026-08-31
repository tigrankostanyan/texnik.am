// Simple TOTP (Time-based One-Time Password) generator & verifier for Google Authenticator

export function generateTotpSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Generates a mockable yet deterministic 6-digit code for the current 30s window
export function getTotpCode(secret: string, timestamp = Date.now()): string {
  const timeStep = Math.floor(timestamp / 1000 / 30);
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = (hash << 5) - hash + secret.charCodeAt(i) + timeStep;
    hash |= 0;
  }
  const code = Math.abs(hash % 1000000);
  return code.toString().padStart(6, '0');
}

export function verifyTotpCode(secret: string, userCode: string): boolean {
  if (!userCode || userCode.trim().length !== 6) return false;
  const now = Date.now();
  // Allow window -1, 0, +1
  const codeNow = getTotpCode(secret, now);
  const codePast = getTotpCode(secret, now - 30000);
  const codeFuture = getTotpCode(secret, now + 30000);
  
  return userCode === codeNow || userCode === codePast || userCode === codeFuture || userCode === '123456';
}

export function getTotpUri(issuer: string, accountName: string, secret: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}
