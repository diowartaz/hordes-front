import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-load-player',
  templateUrl: './load-player.component.html',
  styleUrls: ['./load-player.component.scss'],
})
export class LoadPlayerComponent {
  loadGameLoading: boolean = false;
  constructor(
    private router: Router,
    private cityService: CityService,
    private authService: AuthService
  ) { }

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
          localStorage.setItem('token', '');
          this.router.navigate(['signin']);
        } else {
          this.loadGameLoading = false;
          this.router.navigate(['play']);
        }
      });
  }
}
