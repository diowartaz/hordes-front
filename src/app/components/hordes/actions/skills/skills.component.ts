import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { SkillToIconPipe } from '../../../../shared/pipes/skill-to-icon';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SkillToIconPipe],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  learnLoading = false;
  dialogMessage = 'init';
  snackBarOpened = false;

  constructor(
    public cityService: CityService,
    private _snackBar: MatSnackBar,
  ) {}

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
        this.cityService.userPlayerCityTime$.getValue().seconds + skill.time * this.cityService.city().speeds.learn >
        this.cityService.defaultValues().day_end_time
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
    const isLearnable: boolean =
      this.cityService.userPlayerCityTime$.getValue().seconds + skill.time * this.cityService.city().speeds.learn <=
        this.cityService.defaultValues().day_end_time && skill.lvl < skill.lvl_max;
    return isLearnable;
  }

  getTimeLearnString(skill: any): string {
    return formatTimeToString(skill.time * this.cityService.city().speeds.learn);
  }

  getPercentageEfficacity(skill: any, plusLevel: number) {
    if (skill.id == 4) {
      if (plusLevel === 0) {
        return formatTimeToString(
          this.cityService.defaultValues().day_start_time - skill.reduce_time_seconds * skill.lvl,
        );
      } else {
        return formatTimeToString(
          this.cityService.defaultValues().day_start_time - skill.reduce_time_seconds * (skill.lvl + 1),
        );
      }
    }
    return String(Math.round((1 - skill.avantage_per_lvl * (skill.lvl + plusLevel)) * 100)) + '%';
  }
}
