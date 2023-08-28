import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-death-recap',
  templateUrl: './death-recap.component.html',
  styleUrls: ['./death-recap.component.scss']
})
export class DeathRecapComponent {
  tryAgainLoading: boolean = false;

  constructor(private router: Router, private cityService: CityService) { }

  ngOnInit(): void { }

  getUserPlayerCity$() {
    return this.cityService.userPlayerCity$
  }

  tryAgain() {
    this.tryAgainLoading = true;
    this.cityService
      .delete()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
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

