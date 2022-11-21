import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'website2';
  constructor(private router: Router) {}

  ngOnInit(): void {
    // if (!this.userIsLoggedIn()) {
    //   this.router.navigate(['home']);
    // }
  }

  userIsLoggedIn() {
    return false;
  }
}
