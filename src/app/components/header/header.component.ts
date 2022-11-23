import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuIsDisplayed: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.globalService.menuIsDisplayed$.subscribe((event) => {
      this.menuIsDisplayed = event;
    });
  }

  userIsLoggedIn() {
    return this.authService.userIsLoggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  navigate(route: string) {
    this.menuIsDisplayed = false;
    this.globalService.menuIsDisplayed$.next(this.menuIsDisplayed);
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.globalService.menuIsDisplayed$.unsubscribe();
  }

  changeMenuIsDisplayed() {
    this.menuIsDisplayed = !this.menuIsDisplayed;
    this.globalService.menuIsDisplayed$.next(this.menuIsDisplayed);
  }
}
