import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  useYourAccount() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }
  createAnAccount() {
    this.router.navigate([RoutesEnum.SIGNUP]);
  }
}
