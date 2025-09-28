import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize, take } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth';
import { RoutesEnum } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loading = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  loginTemp() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    this.authService
      .signInTemp()
      .pipe(
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe((result: AuthResponse) => {
        this.handleAuthSuccess(result);
      });
  }

  private handleAuthSuccess(result: AuthResponse): void {
    localStorage.setItem('token', result.token);
    localStorage.setItem('login', result.email);
    this.router.navigate([RoutesEnum.LOAD_PLAYER]);
  }

  useYourAccount() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }
  createAnAccount() {
    this.router.navigate([RoutesEnum.SIGNUP]);
  }
}
