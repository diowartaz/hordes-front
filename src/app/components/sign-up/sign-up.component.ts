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
import { finalize, Subscription, take } from 'rxjs';
import { RoutesEnum } from '../../models/router';
import { AuthService } from 'src/app/services/auth/auth.service';

interface SignUpForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
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
  private passwordValidationSub: Subscription | undefined;

  loading = signal(false);
  emailAlreadyExists = signal(false);
  usernameAlreadyExists = signal(false);

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.setUpFormGroup();
    //this.setupUntouchOnModification();
    this.passwordValidationSub = this.formgroup.controls.password.valueChanges.subscribe(() => {
      this.formgroup.controls.confirmPassword.updateValueAndValidity();
    });
  }

  setUpFormGroup(): void {
    this.formgroup = new FormGroup<SignUpForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.usernameCustomValidator(), this.lessThan15Characters()],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.min8Characters()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.confirmPasswordMatchValidator()],
      }),
    });
  }

  setupUntouchOnModification(): void {
    this.formSubscription = this.formgroup.valueChanges.subscribe(() => {
      if (this.formgroup.controls.email.dirty) {
        this.emailAlreadyExists.set(false);
      }
      if (this.formgroup.controls.username.dirty) {
        this.usernameAlreadyExists.set(false);
      }
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
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe((result: any) => {
        if (result.error) {
          this.emailAlreadyExists.set(result.error.emailAlreadyExists);
          this.usernameAlreadyExists.set(result.error.usernameAlreadyExists);
        } else {
          this.router.navigate([RoutesEnum.SIGNIN]);
        }
      });
  }

  goToSignIn() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }

  min8Characters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const has8Characters = value.length >= 8;

      return !has8Characters ? { min8: true } : null;
    };
  }
  lessThan15Characters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const has15CharactersOrless = value.length <= 15;
      return !has15CharactersOrless ? { max15: true } : null;
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

  fieldHasError(field: keyof SignUpForm): boolean {
    const control = this.formgroup.controls[field];
    return control.touched && control.invalid;
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    if (this.passwordValidationSub) {
      this.passwordValidationSub.unsubscribe();
    }
  }
}
