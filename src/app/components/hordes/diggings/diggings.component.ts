import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diggings',
  templateUrl: './diggings.component.html',
  styleUrls: ['./diggings.component.scss'],
})
export class DiggingsComponent implements OnInit {
  nbDigs: number = 1;
  inventory: any = [
    {
      item: 'wood',
      src: '../../../assets/icons/wood.gif',
      nb: 8,
    },
    {
      item: 'metal',
      src: '../../../assets/icons/metal.gif',
      nb: 2,
    },
    {
      item: 'stone',
      src: '../../../assets/icons/stone.webp',
      nb: 4,
    },
    {
      item: 'screw',
      src: '../../../assets/icons/screw.webp',
      nb: 7,
    },
    {
      item: 'patch',
      src: '../../../assets/icons/patch.webp',
      nb: 2,
    },
  ];
  constructor() {}
  ngOnInit(): void {}

  addDigs(nb: number) {
    console.log("erfverg")
    this.nbDigs = Math.max(this.nbDigs + nb, 1);
  }
}
