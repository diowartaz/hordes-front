import { Component, Input } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent {
  getProfilLoading: boolean = false;
  profil: any = null;
  id: string = '';

  constructor(
    private cityService: CityService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.user_id) {
        this.id = queryParams.user_id;
        this.getProfil();
      }
    });
  }

  getProfil() {
    this.getProfilLoading = true;
    if (this.id == '') {
      this.id = this.authService.getUserId();
    }

    this.cityService
      .getProfil(this.id)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('Error getProfil', this.id);
        } else {
          this.profil = result.profil;
        }
        this.getProfilLoading = false;
      });
  }

  goBack() {
    this.location.back();
  }
}
