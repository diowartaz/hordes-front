import { decodeJwt, isJwtExpired } from './jwt';

function fakeJwt(payload: object): string {
  const base64url = (value: object) =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'HS256' })}.${base64url(payload)}.signature`;
}

describe('jwt', () => {
  const now = Date.UTC(2026, 0, 1);

  it('décode le payload', () => {
    expect(decodeJwt(fakeJwt({ id: 'abc', exp: 123 }))).toEqual({ id: 'abc', exp: 123 });
  });

  it('renvoie undefined pour un token illisible', () => {
    expect(decodeJwt('pas-un-jwt')).toBeUndefined();
    expect(isJwtExpired('pas-un-jwt', now)).toBeTrue();
  });

  it("compare la date d'expiration à maintenant", () => {
    expect(isJwtExpired(fakeJwt({ id: 'a', exp: now / 1000 + 60 }), now)).toBeFalse();
    expect(isJwtExpired(fakeJwt({ id: 'a', exp: now / 1000 - 60 }), now)).toBeTrue();
    expect(isJwtExpired(fakeJwt({ id: 'a' }), now)).toBeFalse();
  });
});
