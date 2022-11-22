import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  formgroup: any = null;
  signUpLoading: boolean = false;
  invalidSignUp: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        this.strongPasswordValidator(),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.confirmPasswordMatchValidator(),
      ]),
    });

    this.formgroup.valueChanges.subscribe(() => {
      this.invalidSignUp = false;
    });
  }

  test() {
    this.signUpLoading = !this.signUpLoading;
  }

  signUp() {
    if (this.signUpLoading) {
      return;
    }
    this.formgroup.markAllAsTouched();
    this.signUpLoading = true;
    const params = {
      email: this.formgroup.controls.email.value,
      username: this.formgroup.controls.username.value,
      password: this.formgroup.controls.password.value,
    };
    this.authService
      .signUp(params)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          this.invalidSignUp = true;
        } else {
          this.invalidSignUp = false;
          this.router.navigate(['home']);
        }
        this.signUpLoading = false;
      });
  }

  signIn() {
    this.router.navigate(['signin']);
  }

  fieldHasError(field: any) {
    return (
      this.formgroup.controls[field].touched &&
      this.formgroup.controls[field].invalid
    );
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) {
        return null;
      }

      const has8Characters = password.length >= 8;
      // const hasUpperCase = /[A-Z]+/.test(password);
      // const hasLowerCase = /[a-z]+/.test(password);
      // const hasNumeric = /[0-9]+/.test(password);
      // const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && has8Characters;

      const passwordValid = has8Characters;

      return !passwordValid ? { noStrong: true } : null;
    };
  }

  confirmPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      if (!confirmPassword) {
        return null;
      }

      const confirmPasswordValid =
        this.formgroup.controls.password.value == confirmPassword;

      return !confirmPasswordValid ? { noMatchPassword: true } : null;
    };
  }
}
