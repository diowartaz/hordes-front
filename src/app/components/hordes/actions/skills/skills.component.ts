import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CityService } from 'src/app/services/city/city.service';
import { SkillToIconPipe } from '../../../../shared/pipes/skill-to-icon';
import { AdvancedSkillModel } from 'src/app/models/hordes';

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

  learn(skill: AdvancedSkillModel) {
    if (this.cityService.cityTimeSeconds() || 0 > skill.expirationCityTime) {
      this.openSnackBar('Not enough time');
      return;
    } else if (!skill.enoughLvlMax) {
      this.openSnackBar('Already at max level');
      return;
    }

    this.cityService.learn(skill.id);
  }
}
