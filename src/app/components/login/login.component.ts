import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  loginLoading: boolean = false;
  invalidAuthentification = false;

  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required]),
    });

    this.formgroup.valueChanges.subscribe(() => {
      this.invalidAuthentification = false;
    });
  }

  login() {
    if (this.loginLoading) {
      return;
    }
    this.formgroup.markAllAsTouched();
    if(this.formgroup.invalid){
      this.invalidAuthentification = true;
      return;
    }
    this.loginLoading = true;
    const params = {
      email: this.formgroup.controls.email.value,
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
          this.router.navigate(['home']);
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
}
