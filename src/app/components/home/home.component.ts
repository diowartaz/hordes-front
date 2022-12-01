import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userInfos: any = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfos = this.authService.parseJwt();
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }
}
