import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, OnDestroy } from '@angular/core';
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
import { RoutesEnum } from '../../models/router';
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
export class SignUpComponent implements OnInit, OnDestroy {
  formgroup!: FormGroup<SignUpForm>;
  private formSubscription: Subscription | undefined;

  loading = signal(false);
  invalid = signal(false);

  subscriptions: Subscription[] = [];
  fieldAlreadyExist: FieldAlreadyExistModel = {
    email: false,
    username: false,
  };

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup<SignUpForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
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

    // this.subscriptions.push(
    //   this.formgroup.valueChanges.subscribe(() => {
    //     this.invalid.set(false);
    //     this.fieldAlreadyExist = {
    //       email: false,
    //       username: false,
    //     };
    //   }),
    // );
    this.setupUntouchOnModification();
  }

  setupUntouchOnModification(): void {
    this.formSubscription = this.formgroup.valueChanges.subscribe(() => {
      Object.keys(this.formgroup.controls).forEach((key) => {
        const control = this.formgroup.get(key);
        if (control && control.dirty) {
          control.markAsUntouched();
        }
      });
    });
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

      const has8Characters = password.length >= 8;
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

  shouldShowError(fieldName: string): boolean {
    const field = this.formgroup.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  ngOnDestroy(): void {
    // Vérifier si l'abonnement existe et n'a pas déjà été fermé
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
