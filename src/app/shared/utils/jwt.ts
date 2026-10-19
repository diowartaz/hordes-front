import { JwtPayload } from 'src/app/models/auth';

// Décode la partie payload d'un JWT (sans vérifier la signature, c'est le rôle du back)
export function decodeJwt(token: string): JwtPayload | undefined {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return undefined;
  }
}

// Un token sans date d'expiration est considéré valide, un token illisible est considéré expiré
export function isJwtExpired(token: string, nowMs: number = Date.now()): boolean {
  const payload = decodeJwt(token);
  if (!payload) {
    return true;
  }
  if (payload.exp === undefined) {
    return false;
  }
  return payload.exp * 1000 <= nowMs;
}
