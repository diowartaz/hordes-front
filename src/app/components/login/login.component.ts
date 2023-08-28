import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formgroup: any = null;
  loginLoading: boolean = false;
  invalidAuthentification = false;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      emailOrUsername: new FormControl(localStorage.getItem('emailOrUsername'), [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });

    this.subscriptions.push(
      this.formgroup.valueChanges.subscribe(() => {
        this.invalidAuthentification = false;
      })
    );
  }

  login() {
    if (this.loginLoading) {
      return;
    }
    this.formgroup.markAllAsTouched();
    if (this.formgroup.invalid) {
      this.invalidAuthentification = true;
      return;
    }
    this.loginLoading = true;
    const params = {
      login: this.formgroup.controls.emailOrUsername.value,
      password: this.formgroup.controls.password.value,
    };
    this.authService
      .signIn(params)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          this.invalidAuthentification = true;
        } else {
          this.invalidAuthentification = false;
          localStorage.setItem('token', result.token);
          localStorage.setItem('emailOrUsername', params.login);
          this.router.navigate(['load-player']);
        }
        this.loginLoading = false;
      });
  }

  loginTemp() {
    if (this.loginLoading) {
      return;
    }
    this.authService
      .signInTemp()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
        } else {
          localStorage.setItem('token', result.token);
          localStorage.setItem('emailOrUsername', result.email);
          this.router.navigate(['load-player']);
        }
        this.loginLoading = false;
      });
  }

  signUp() {
    this.router.navigate(['signup']);
  }

  forgotPassword() {
    console.log('TODO');
  }

  fieldHasError(field: any) {
    return (
      this.formgroup.controls[field].touched &&
      this.formgroup.controls[field].invalid
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
