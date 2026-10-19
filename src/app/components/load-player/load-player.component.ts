import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-load-player',
  imports: [MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './load-player.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './load-player.component.scss',
})
export class LoadPlayerComponent implements OnInit {
  private cityService = inject(CityService);

  ngOnInit(): void {
    this.cityService.loadPlayer();
  }

  // loadPlayer() {
  //   this.loading.set(true);
  //   this.cityService
  //     .loadPlayer()
  //     .pipe(
  //       take(1),
  //       finalize(() => {
  //         this.loading.set(false);
  //       }),
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.loading.set(false);
  //         let url = statesToRoutes[response.player.state as UserState].toString();
  //         if (url === 'play') {
  //           url += '/' + localStorage.getItem('play-route') || '';
  //         }
  //         this.router.navigate([url]);
  //       },
  //       error: () => {
  //         localStorage.setItem('token', '');
  //         this.router.navigate(['signin']);
  //       },
  //     });
  // }
}
