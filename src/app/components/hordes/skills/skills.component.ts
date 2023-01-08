import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { CityModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';

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
  string: any[] = [
    '8h00',
    '7h45',
    '7h30',
    '7h15',
    '7h00',
    '6h45',
    '6h30',
    '6h15',
    '6h00',
  ];

  constructor(
    private cityService: CityService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
      if (city) {
        this.city = city;
        this.skills = [...this.city.skills];
      }
    });
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

  getPercentageEfficacity(skill: any) {
    if (skill.id == 4) {
      return this.string[skill.lvl];
    }
    return (
      String(Math.round((1 / (1 - skill.avantage_per_lvl * skill.lvl)) * 100)) +
      '%'
    );
  }

  getPercentageEfficacityNextLevel(skill: any) {
    if (skill.id == 4) {
      return this.string[skill.lvl + 1];
    }
    return (
      String(
        Math.round((1 / (1 - skill.avantage_per_lvl * (skill.lvl + 1))) * 100)
      ) + '%'
    );
  }
}
