import { RoutesEnum } from 'src/app/models/router';
import { readStorage, removeStorage, StorageKey, writeStorage } from './storage';

// Paramètre des liens d'invitation : /signup?ref=CODE
export const REFERRAL_QUERY_PARAM = 'ref';

// Les codes sont en majuscules côté API, qui accepte aussi les minuscules
export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

// Garde le code d'un lien d'invitation jusqu'à l'inscription ou au choix du parrain
export function captureReferralCode(): void {
  const code = new URLSearchParams(window.location.search).get(REFERRAL_QUERY_PARAM);
  if (code?.trim()) {
    writeStorage(StorageKey.REFERRAL_CODE, normalizeReferralCode(code));
  }
}

export function pendingReferralCode(): string {
  return readStorage(StorageKey.REFERRAL_CODE) ?? '';
}

export function clearPendingReferralCode(): void {
  removeStorage(StorageKey.REFERRAL_CODE);
}

export function invitationLink(code: string): string {
  return `${window.location.origin}/${RoutesEnum.SIGNUP}?${REFERRAL_QUERY_PARAM}=${encodeURIComponent(code)}`;
}
