import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
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

  navigate(route: string) {
    this.menuIsDisplayed = false;
    this.globalService.menuIsDisplayed$.next(this.menuIsDisplayed);
    this.router.navigate([route]);
  }

  userIsLoggedIn() {
    return this.authService.userIsLoggedIn();
  }

  ngOnDestroy() {
    this.globalService.menuIsDisplayed$.unsubscribe();
  }
}
