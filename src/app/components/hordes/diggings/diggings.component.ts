import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { buildingInventoryToUsableInventory, getNewInventory } from 'src/app/shared/utils/inventory';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { CityModel } from 'src/app/models/hordes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diggings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diggings.component.html',
  styleUrls: ['./diggings.component.scss'],
})
export class DiggingsComponent implements OnInit, OnDestroy {
  nbDigs = 1;
  inventory: any = getNewInventory();
  city: CityModel | null = null;
  digLoading = false;
  initDone = false;
  subscriptions: Subscription[] = [];

  constructor(private cityService: CityService) {}
  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
        this.city = city;
        if (!this.initDone && this.city) {
          this.inventory = buildingInventoryToUsableInventory(this.city.inventory as Record<string, number>)//TODO meilleur typage
        }
      }),
    );
  }

  addDigs(nb: number) {
    this.nbDigs = Math.max(this.nbDigs + nb, 1);
  }

  disableMinusDigs(): boolean {
    return this.nbDigs - 1 < 1;
  }

  getDiggingsTime(): number {
    if (!this.city) {
      return 2 * 60 * 60;
    }

    return (
      this.nbDigs * this.cityService.defaultValues$.getValue().digging_time * this.city.speeds.dig
    );
  }

  getDiggingsTimeString() {
    return formatTimeToString(this.getDiggingsTime());
  }

  digDisabled(): boolean {
    if (!this.city) {
      return true;
    }
    return (
      this.getDiggingsTime() + this.city.time >
      this.cityService.defaultValues$.getValue().day_end_time
    );
  }

  dig() {
    if (this.digLoading || this.digDisabled()) {
      return;
    }
    this.digLoading = true;
    this.cityService
      .findItems(this.nbDigs)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error');
        } else {
          this.nbDigs = 1;
          if (this.city) {
            this.inventory = buildingInventoryToUsableInventory(this.city.inventory as Record<string, number>)//TODO meilleur typage
            this.addItemsFound(result.items_found_inventory);
          }
        }
        this.digLoading = false;
      });
  }

  addItemsFound(items_found_inventory: any) {
    for (const item of this.inventory) {
      item.found = 0;
    }
    for (const itemName in items_found_inventory) {
      for (const item2 of this.inventory) {
        if (itemName == item2.name) {
          item2.found = items_found_inventory[itemName];
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
