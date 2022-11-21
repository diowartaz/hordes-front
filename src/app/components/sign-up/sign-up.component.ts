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
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.confirmPasswordMatch(),
      ]),
    });
  }

  test(){
    this.signUpLoading = !this.signUpLoading
  }

  signUp() {
    if(this.signUpLoading){
      return;
    }
    this.signUpLoading = true;
    const params = {
      email: this.formgroup.controls.email.value,
      username: this.formgroup.controls.username.value,
      password: this.formgroup.controls.password.value,
    };
    console.log('signUp', params);
    this.authService
      .signUp(params)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log(result);
        } else {
          console.log(result);
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

  // createPasswordStrengthValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;

  //     if (!value) {
  //       return null;
  //     }

  //     const hasUpperCase = /[A-Z]+/.test(value);

  //     const hasLowerCase = /[a-z]+/.test(value);

  //     const hasNumeric = /[0-9]+/.test(value);

  //     const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

  //     return !passwordValid ? { passwordStrength: true } : null;
  //   };
  // }

  confirmPasswordMatch(): ValidatorFn {
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
