export function getLvl(xp: any) {
  return Math.floor(10.4067 * Math.log(6.62457 + 0.00043575 * xp) - 19.6018);
}

export function getXpForLvl(lvl: any) {
  return Math.floor(
    (Math.exp((lvl + 19.6018) / 10.4067) - 6.62457) / 0.00043575
  );
}
