import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { CityModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { xpToLvl } from 'src/app/shared/utils/xp';
import { SkillToIconPipe } from '../../../../shared/pipes/skill-to-icon';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SkillToIconPipe],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  city: any = null;
  skills: any = [];
  learnLoading = false;
  dialogMessage = 'init';
  snackBarOpened = false;
  day_start_time = 0;

  constructor(
    private cityService: CityService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
      if (city) {
        this.city = city;
        this.skills = [...this.city.skills];
      }
    });

    this.day_start_time =
      this.cityService.defaultValues$.getValue().day_start_time -
      xpToLvl(this.cityService.userPlayerStats$.getValue().xp) * 60;
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
        this.cityService.userPlayerCityTime$.getValue().seconds + skill.time * this.city.speeds.learn >
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
        catchError(() => of({ error: 'error' })),
      )
      .subscribe(() => {
        this.learnLoading = false;
      });
  }

  isLearnable(skill: any) {
    if (this.city) {
      const isLearnable: boolean =
        this.cityService.userPlayerCityTime$.getValue().seconds + skill.time * this.city.speeds.learn <=
          this.cityService.defaultValues$.getValue().day_end_time && skill.lvl < skill.lvl_max;
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
    return formatTimeToString(skill.time * this.city.speeds.learn);
  }

  getPercentageEfficacity(skill: any, plusLevel: number) {
    if (skill.id == 4) {
      if (plusLevel === 0) {
        return formatTimeToString(this.day_start_time - skill.reduce_time_seconds * skill.lvl);
      } else {
        return formatTimeToString(this.day_start_time - skill.reduce_time_seconds * (skill.lvl + 1));
      }
    }
    return String(Math.round((1 - skill.avantage_per_lvl * (skill.lvl + plusLevel)) * 100)) + '%';
  }
}
