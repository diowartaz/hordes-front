import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-load-player',
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './load-player.component.html',
  styleUrl: './load-player.component.scss',
})
export class LoadPlayerComponent implements OnInit {
  loading = signal(false);
  constructor(private router: Router, private cityService: CityService) {}

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
        next: () => {
          this.loading.set(false);
          this.router.navigate(['play/' + localStorage.getItem('play-route')]);
        },
        error: () => {
          localStorage.setItem('token', '');
          this.router.navigate(['signin']);
        },
      });
  }
}
