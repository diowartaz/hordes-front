import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { RoutesEnum } from '../../models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignUpParams } from 'src/app/models/auth';
import {
  emailValidators,
  matchValidator,
  newPasswordValidators,
  usernameValidators,
} from 'src/app/shared/utils/auth-validators';
import { getAuthErrorMessage, getConflictError } from 'src/app/shared/utils/auth-errors';

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
export class SignUpComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  formgroup!: FormGroup<SignUpForm>;

  loading = signal(false);
  emailAlreadyExists = signal(false);
  usernameAlreadyExists = signal(false);
  errorMessage = signal<string | undefined>(undefined);

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup<SignUpForm>({
      email: new FormControl('', { nonNullable: true, validators: emailValidators }),
      username: new FormControl('', { nonNullable: true, validators: usernameValidators }),
      password: new FormControl('', { nonNullable: true, validators: newPasswordValidators }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, matchValidator('password')],
      }),
    });

    this.formgroup.controls.password.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formgroup.controls.confirmPassword.updateValueAndValidity();
    });
    // Les erreurs du back ne concernent plus la saisie dès qu'elle change
    this.formgroup.controls.email.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emailAlreadyExists.set(false);
    });
    this.formgroup.controls.username.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.usernameAlreadyExists.set(false);
    });
    this.formgroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.errorMessage.set(undefined);
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
    const params: SignUpParams = {
      email: this.formgroup.controls.email.value.trim().toLowerCase(),
      username: this.formgroup.controls.username.value.trim(),
      password: this.formgroup.controls.password.value,
    };
    // En cas de succès l'utilisateur est connecté et le RedirectionService l'envoie vers le jeu
    this.authService
      .signUp(params)
      .pipe(
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        error: (error) => {
          const conflict = getConflictError(error);
          if (conflict) {
            this.emailAlreadyExists.set(conflict.emailAlreadyExists);
            this.usernameAlreadyExists.set(conflict.usernameAlreadyExists);
          } else {
            this.errorMessage.set(getAuthErrorMessage(error));
          }
        },
      });
  }

  goToSignIn() {
    this.router.navigate([RoutesEnum.SIGNIN]);
  }

  fieldHasError(field: keyof SignUpForm): boolean {
    const control = this.formgroup.controls[field];
    return control.touched && control.invalid;
  }
}
