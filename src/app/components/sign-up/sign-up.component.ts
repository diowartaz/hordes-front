import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, finalize, of, Subscription, take } from 'rxjs';
import { AuthResponse } from '../../models/auth';
import { RoutesEnum } from '../../models/routes';
import { AuthService } from 'src/app/services/auth/auth.service';

interface SignUpForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

interface FieldAlreadyExistModel {
  email: boolean;
  username: boolean;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  standalone: true,
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  formgroup!: FormGroup<SignUpForm>;

  loading = signal(false);
  invalid = signal(false);

  subscriptions: Subscription[] = [];
  fieldAlreadyExist: FieldAlreadyExistModel = {
    email: false,
    username: false,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup<SignUpForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.usernameCustomValidator()],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.strongPasswordValidator()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.confirmPasswordMatchValidator()],
      }),
    });

    this.subscriptions.push(
      this.formgroup.valueChanges.subscribe(() => {
        this.invalid.set(false);
        this.fieldAlreadyExist = {
          email: false,
          username: false,
        };
      }),
    );
  }

  signUp() {
    if (this.loading()) {
      return;
    }
    this.formgroup.markAllAsTouched();
    if (this.formgroup.invalid) {
      this.invalid.set(true);
      return;
    }
    this.loading.set(true);
    const params = {
      email: this.formgroup.controls.email.value,
      username: this.formgroup.controls.username.value,
      password: this.formgroup.controls.password.value,
    };
    this.authService
      .signUp(params)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe((result: AuthResponse | { error: string }) => {
        //TODO: Gérer le cas où l'email ou le nom d'utilisateur existe déjà: voir ancien projet
        if ('error' in result) {
          this.invalid.set(true);
        } else {
          this.invalid.set(false);
          this.router.navigate([RoutesEnum.SIGNIN]);
        }
      });
  }

  signIn() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }

  fieldHasError(field: keyof SignUpForm): boolean {
    const control = this.formgroup.controls[field];
    return control.touched && control.invalid;
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) {
        return null;
      }

      const has8Characters = password.length >= 4;
      // const hasUpperCase = /[A-Z]+/.test(password);
      // const hasLowerCase = /[a-z]+/.test(password);
      // const hasNumeric = /[0-9]+/.test(password);
      // const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && has8Characters;

      const passwordValid = has8Characters;

      return !passwordValid ? { noStrong: true } : null;
    };
  }

  usernameCustomValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;
      if (!username) {
        return null;
      }
      const has3Characters = username.length >= 3;
      const usernameValid = has3Characters;
      return !usernameValid ? { notValid: true } : null;
    };
  }

  confirmPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      if (!confirmPassword) {
        return null;
      }

      const confirmPasswordValid = this.formgroup.controls.password.value == confirmPassword;

      return !confirmPasswordValid ? { noMatchPassword: true } : null;
    };
  }

  loginTemp() {
    if (this.loading()) {
      return;
    }
    this.authService
      .signInTemp()
      .pipe(
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe((result: AuthResponse) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('emailOrUsername', result.email);
        this.router.navigate(['load-player']);
      });
  }
}
