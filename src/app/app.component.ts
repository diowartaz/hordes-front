import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  menuIsDisplayed: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  userIsLoggedIn() {
    //TODO trop d'appels -> behavior subject?
    return this.authService.userIsLoggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  goHome() {
    this.router.navigate(['home']);
  }

  changeMenuIsDisplayed() {
    this.menuIsDisplayed = !this.menuIsDisplayed;
  }

  navigate(route: string) {
    this.menuIsDisplayed = false;
    this.router.navigate([route]);
  }
}
