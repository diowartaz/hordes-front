import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { CityModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';
import { xpToLvl } from 'src/app/shared/utils/xp';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  city: any = null;
  skills: any = [];
  learnLoading: boolean = false;
  dialogMessage: string = 'init';
  snackBarOpened: boolean = false;

  mappingSkillIdToIcon: any = {
    1: "../../../../assets/icons/pelle.gif",
    2: "../../../../assets/icons/livre.gif",
    3: "../../../../assets/icons/build.webp",
    4: "../../../assets/icons/sleep.gif",
  }

  day_start_time: number = 0

  constructor(
    private cityService: CityService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
      if (city) {
        this.city = city;
        this.skills = [...this.city.skills];
      }
    });

    this.day_start_time = this.cityService.defaultValues$.getValue().day_start_time - xpToLvl(this.cityService.userPlayerStats$.getValue().xp) * 60
  }

  closeSnackBar() {
    this.snackBarOpened = false;
  }

  openSnackBar(message: string) {
    this.dialogMessage = message;
    this.snackBarOpened = true;
  }

  learn(skill: any) {
    if (this.learnLoading) {
      return;
    }
    if (!this.isLearnable(skill)) {
      if (
        this.cityService.userPlayerCityTime$.getValue().seconds +
        skill.time * this.city.speeds.learn >
        this.cityService.defaultValues$.getValue().day_end_time
      ) {
        this.openSnackBar('Not enough time');
      } else if (skill.lvl == skill.lvl_max) {
        this.openSnackBar('Already at max level');
      } else {
        this.openSnackBar('Not enough items');
      }
      return;
    }
    this.learnLoading = true;
    this.cityService
      .learn(skill.id)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error');
        } else {
        }
        this.learnLoading = false;
      });
  }

  isLearnable(skill: any) {
    if (this.city) {
      let isLearnable: boolean =
        this.cityService.userPlayerCityTime$.getValue().seconds +
        skill.time * this.city.speeds.learn <=
        this.cityService.defaultValues$.getValue().day_end_time &&
        skill.lvl < skill.lvl_max;
      return isLearnable;
    } else {
      return false;
    }
    return true;
  }

  getTimeLearnString(skill: any): string {
    if (!this.city) {
      return '__h__';
    }
    return getTimeString(skill.time * this.city.speeds.learn);
  }

  getPercentageEfficacity(skill: any, plusLevel: number) {
    if (skill.id == 4) {
      if (plusLevel === 0) {
        return getTimeString(this.day_start_time - skill.reduce_time_seconds * skill.lvl)
      } else {
        return getTimeString(this.day_start_time - skill.reduce_time_seconds * (skill.lvl + 1))
      }
    }
    return (
      String(
        Math.round((1 - skill.avantage_per_lvl * (skill.lvl + plusLevel)) * 100)
      ) + '%'
    );
  }
}
