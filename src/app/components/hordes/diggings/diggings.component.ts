import { Component, OnInit } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-diggings',
  templateUrl: './diggings.component.html',
  styleUrls: ['./diggings.component.scss'],
})
export class DiggingsComponent implements OnInit {
  nbDigs: number = 1;
  inventory: any = [
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
      src: '../../../assets/icons/stone.webp',
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
  city: any = null;
  digLoading: boolean = false;

  constructor(private cityService: CityService) {}
  ngOnInit(): void {
    this.cityService.userGameCity$.subscribe((city: any) => {
      this.city = city;
      this.buildCustomCityInventory();
    });
  }

  addDigs(nb: number) {
    console.log("addDigs")
    this.nbDigs = Math.max(this.nbDigs + nb, 1);
  }

  disableMinusDigs() {
    return this.nbDigs - 1 < 1;
  }

  getHourString(seconds: number): any {
    let nbHeures = Math.floor(seconds / 3600);
    let nbMinutesInSeconds: number = (seconds - nbHeures * 3600) % 3600;
    let nbMinutes: number = Math.floor(nbMinutesInSeconds / 36);
    let nbMinutesString: string = nbMinutes + '';
    if (nbMinutes < 10) {
      nbMinutesString = '0' + nbMinutes;
    }
    return nbHeures + 'h' + nbMinutesString;
  }

  getDiggingsTime() {
    return this.nbDigs + 'h';
  }

  getDiggingsTimeString() {
    return this.nbDigs + 'h';
  }

  dig() {
    if (this.digLoading) {
      return;
    }
    this.digLoading = true;
    this.cityService
      .findItems(this.nbDigs)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error');
        } else {
          this.nbDigs = 1;
          for (let item of this.inventory) {
            item.found = 0;
          }
          for (let itemName in result.items_found_inventory) {
            for (let item2 of this.inventory) {
              if (itemName == item2.name) {
                item2.found = result.items_found_inventory[itemName];
                break;
              }
            }
          }
        }
        this.digLoading = false;
      });
  }

  buildCustomCityInventory() {
    for (let itemName in this.city.inventory) {
      for (let item2 of this.inventory) {
        if (itemName == item2.name) {
          item2.nb = this.city.inventory[itemName];
          break;
        }
      }
    }
  }
}
