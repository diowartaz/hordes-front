export function contains(inv1: any, inv2: any) {
  return Object.keys(inv2).every((key) => Object.prototype.hasOwnProperty.call(inv1, key) && inv1[key] >= inv2[key]);
}
