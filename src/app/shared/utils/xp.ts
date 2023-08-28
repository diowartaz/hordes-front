export function getLVLandXPString(xp: number): any {
    let lvl = xpToLvl(xp)
    let reste = xp - lvlToXp(lvl);
    let xpToNextLvl = lvlToXp(lvl + 1) - lvlToXp(lvl)
    return {
        lvl: lvl,
        xpString: reste + '/' + xpToNextLvl + ' xp',
    };
}
export function xpToLvl(xp: number) {
    let lvl = -5.9 + 3 * Math.log(xp + 10)
    return Math.floor(lvl);
}

export function lvlToXp(lvl: number) {
    let xp = Math.E ** ((lvl + 5.9) / 3) - 10
    return Math.floor(xp)
}

// export function getLvl(xp: any) {
//     return Math.floor(10.4067 * Math.log(6.62457 + 0.00043575 * xp) - 19.6018);
//   }
  
//   export function getXpForLvl(lvl: any) {
//     return Math.floor(
//       (Math.exp((lvl + 19.6018) / 10.4067) - 6.62457) / 0.00043575
//     );
//   }