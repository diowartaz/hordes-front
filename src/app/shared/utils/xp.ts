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