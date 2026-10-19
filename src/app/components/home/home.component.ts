import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { RoutesEnum } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  authService = inject(AuthService);

  public readonly router = inject(Router);
  public readonly RoutesEnum = RoutesEnum;

  useYourAccount() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }
  createAnAccount() {
    this.router.navigate([RoutesEnum.SIGNUP]);
  }
}
