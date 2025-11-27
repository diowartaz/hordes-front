import { Component, OnInit } from '@angular/core';
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
  constructor(private cityService: CityService) {}

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
