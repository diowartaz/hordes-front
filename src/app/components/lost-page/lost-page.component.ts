import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lost-page',
  templateUrl: './lost-page.component.html',
  styleUrls: ['./lost-page.component.scss'],
})
export class LostPageComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['home']);
  }
}
