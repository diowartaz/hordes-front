import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formgroup: any = null;

  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  login() {
    const params = {
      email: this.formgroup.controls.email.value,
      password: this.formgroup.controls.password.value,
    };
    console.log('login', params);
    this.authService
      .signIn(params)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log(result);
        } else {
          localStorage.setItem('token', result.token);
          this.router.navigate(['home']);
        }
      });
  }

  signUp() {
    this.router.navigate(['signup']);
  }

  forgotPassword() {
    this.notImplemented();
  }

  notImplemented() {
    console.log('not implemented');
    // this._snackBar.open('not implemented', '', {
    //   duration: 3000,
    // });
    // this._snackBar.open("message");
  }
}
