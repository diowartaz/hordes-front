import { Component, OnInit } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, GameComponent, MatProgressSpinnerModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  getProfilLoading = false;
  profil: any = null;
  id = '';

  constructor(
    private cityService: CityService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.user_id) {
        this.id = queryParams.user_id;
        this.getProfil();
      }
    });
  }

  player1Wins(player1: any, player2: any) {
    if (!player2.defense) {
      return null;
    }
    if (player1.defense >= player2.defense) {
      return true;
    }
    return false;
  }

  getProfil() {
    this.getProfilLoading = true;
    if (this.id == '') {
      this.id = this.authService.getUserId() || "";
    }

    this.cityService
      .getProfil(this.id)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        console.log(result);
        if (result.error) {
          console.log('Error getProfil', this.id);
        } else {
          this.profil = result.profil;
          this.profil.match_history.forEach((match: any) => {
            match.win = this.player1Wins(match.player1, match.player2);
          });
        }
        this.getProfilLoading = false;
      });
  }

  goBack() {
    this.location.back();
  }
}
