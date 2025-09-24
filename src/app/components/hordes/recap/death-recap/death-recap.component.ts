import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { RecapHeaderComponent } from '../recap-header/recap-header.component';
import { CommonModule } from '@angular/common';
import { GameComponent } from 'src/app/components/classic-page/profil/game/game.component';

@Component({
  selector: 'app-death-recap',
  standalone: true,
  imports: [RecapHeaderComponent, GameComponent, CommonModule],
  templateUrl: './death-recap.component.html',
  styleUrls: ['./death-recap.component.scss'],
})
export class DeathRecapComponent {
  tryAgainLoading = false;

  constructor(
    private router: Router,
    private cityService: CityService,
  ) {

    console.log(this.cityService.userPlayerStats$.getValue())
  }

  getUserPlayerCity$() {
    return this.cityService.userPlayerCity$;
  }

  getUserPlayerStats$() {
    return this.cityService.userPlayerStats$;
  }

  tryAgain() {
    this.tryAgainLoading = true;
    this.cityService
      .delete()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error delete game');
        } else {
          this.router.navigate(['create-city']);
        }
        this.tryAgainLoading = false;
      });
  }
}
