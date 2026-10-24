import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { SkillToColorPipe, SkillToIconPipe } from 'src/app/shared/pipes/skill-to-icon.pipe';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { AdvancedSkillModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-skills',
  imports: [SkillToIconPipe, SkillToColorPipe, IconComponent],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  cityService = inject(CityService);

  dialogMessage = signal('');
  snackBarOpened = signal(false);
  private snackBarTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.snackBarTimeout));
  }

  // Une case de jauge par niveau
  pipsOf(count: number): number[] {
    return Array.from({ length: count });
  }

  closeSnackBar() {
    clearTimeout(this.snackBarTimeout);
    this.snackBarOpened.set(false);
  }

  openSnackBar(message: string) {
    if (this.snackBarOpened()) {
      return;
    }
    this.dialogMessage.set(message);
    this.snackBarOpened.set(true);
    this.snackBarTimeout = setTimeout(() => this.closeSnackBar(), 1000);
  }

  learn(skill: AdvancedSkillModel) {
    if ((this.cityService.cityTimeSeconds() || 0) > skill.expirationCityTime) {
      this.openSnackBar('Not enough time');
      return;
    } else if (!skill.enoughLvlMax) {
      this.openSnackBar('Already at max level');
      return;
    }

    this.cityService.learn(skill.id);
  }
}
