const customInventoryDefault: any = [
  {
    name: 'wood',
    src: '../../../assets/icons/wood.gif',
    nb: 0,
    found: 0,
  },
  {
    name: 'metal',
    src: '../../../assets/icons/metal.gif',
    nb: 0,
    found: 0,
  },
  {
    name: 'stone',
    src: '../../../assets/icons/caillou.webp',
    nb: 0,
    found: 0,
  },
  {
    name: 'screw',
    src: '../../../assets/icons/screw.webp',
    nb: 0,
    found: 0,
  },
  {
    name: 'patch',
    src: '../../../assets/icons/patch.webp',
    nb: 0,
    found: 0,
  },
];

export function getCustomInventoryDefault() {
  let newCustomInventoryDefault: any = [];
  for (let item of customInventoryDefault) {
    newCustomInventoryDefault.push({ ...item });
  }
  return newCustomInventoryDefault;
}

export function updateCustomInventory(
  customInventory: any,
  inventory: any
): any {
  //   let inventory = { wood: 2, stone: 2, patch: 4 };
  if (!inventory) {
    // buildings without inventory cause bugs without this
    inventory = {};
  }
  for (let item of customInventory) {
    if (inventory[item.name]) {
      item.nb = inventory[item.name];
    }
  }

  //   let customInventory = [
  //     { name: 'wood', nb: 2, src: '' },
  //     { name: 'stone', nb: 2, src: '' },
  //     { name: 'patch', nb: 4, src: '' },
  //   ];
  return customInventory;
}
