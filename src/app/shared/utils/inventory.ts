import { InventoryItem } from '../../models/hordes';

const emptyInventory: InventoryItem[] = [
  { name: 'wood', src: 'assets/icons/wood.gif', nb: 0, found: 0 },
  { name: 'metal', src: 'assets/icons/metal.gif', nb: 0, found: 0 },
  { name: 'stone', src: 'assets/icons/caillou.webp', nb: 0, found: 0 },
  { name: 'screw', src: 'assets/icons/screw.webp', nb: 0, found: 0 },
  { name: 'patch', src: 'assets/icons/patch.webp', nb: 0, found: 0 },
];

//getCustomInventoryDefault
export function getNewInventory(): InventoryItem[] {
  return emptyInventory.map((item) => ({ ...item }));
}

//updateCustomInventory
export function buildingInventoryToUsableInventory(
  inventory: Record<string, number> = {}
): InventoryItem[] {
  return getNewInventory().map((item) => ({
    ...item,
    nb: inventory[item.name] ?? 0,
  }));
}
