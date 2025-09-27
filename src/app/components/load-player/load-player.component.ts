import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CityService } from 'src/app/services/city/city.service';
import { statesToRoutes, UserSate } from 'src/app/models/router';

@Component({
  selector: 'app-load-player',
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './load-player.component.html',
  styleUrl: './load-player.component.scss',
})
export class LoadPlayerComponent implements OnInit {
  loading = signal(false);
  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.loadPlayer();
  }

  loadPlayer() {
    this.loading.set(true);
    this.cityService
      .loadPlayer()
      .pipe(
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          let url = statesToRoutes[response.player.state as UserSate].toString();
          if (url === 'play') {
            url += '/' + localStorage.getItem('play-route') || '';
          }
          this.router.navigate([url]);
        },
        error: () => {
          localStorage.setItem('token', '');
          this.router.navigate(['signin']);
        },
      });
  }
}
