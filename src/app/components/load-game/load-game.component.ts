import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-load-game',
  templateUrl: './load-game.component.html',
  styleUrls: ['./load-game.component.scss'],
})
export class LoadGameComponent {
  loadGameLoading: boolean = false;
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    this.loadGame();
  }

  loadGame() {
    this.loadGameLoading = true;
    this.cityService
      .loadGame()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error load game');
          //sleep an retry
          this.loadGame();
        } else {
          this.router.navigate(['game']);
          this.loadGameLoading = false;
        }
      });
  }
}
