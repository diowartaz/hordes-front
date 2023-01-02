import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-load-player',
  templateUrl: './load-player.component.html',
  styleUrls: ['./load-player.component.scss'],
})
export class LoadPlayerComponent {
  loadGameLoading: boolean = false;
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    this.loadPlayer();
  }

  loadPlayer() {
    this.loadGameLoading = true;
    this.cityService
      .loadPlayer()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error load player');
          //sleep an retry
          setTimeout(() => this.loadPlayer(), 1000);
        } else {
          this.loadGameLoading = false;
          this.router.navigate(['play']);
        }
      });
  }
}
