import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClassicPageComponent } from '../classic-page.component';
import {
  emailValidators,
  matchValidator,
  newPasswordValidators,
  usernameValidators,
} from 'src/app/shared/utils/auth-validators';
import { getAuthErrorMessage, getConflictError } from 'src/app/shared/utils/auth-errors';

interface UpgradeForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

interface ChangePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly authService = inject(AuthService);

  upgradeForm!: FormGroup<UpgradeForm>;
  upgradeLoading = signal(false);
  upgradeError = signal<string | undefined>(undefined);
  emailAlreadyExists = signal(false);
  usernameAlreadyExists = signal(false);

  passwordForm!: FormGroup<ChangePasswordForm>;
  passwordLoading = signal(false);
  passwordError = signal<string | undefined>(undefined);
  passwordChanged = signal(false);

  logOutAllLoading = signal(false);
  logOutAllError = signal<string | undefined>(undefined);

  deletePassword = new FormControl('', { nonNullable: true });
  showDeleteConfirmation = signal(false);
  deleteError = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.upgradeForm = new FormGroup<UpgradeForm>({
      email: new FormControl('', { nonNullable: true, validators: emailValidators }),
      username: new FormControl(this.authService.username() ?? '', {
        nonNullable: true,
        validators: usernameValidators,
      }),
      password: new FormControl('', { nonNullable: true, validators: newPasswordValidators }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, matchValidator('password')],
      }),
    });
    this.passwordForm = new FormGroup<ChangePasswordForm>({
      currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      newPassword: new FormControl('', { nonNullable: true, validators: newPasswordValidators }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, matchValidator('newPassword')],
      }),
    });

    this.upgradeForm.controls.password.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.upgradeForm.controls.confirmPassword.updateValueAndValidity();
    });
    this.passwordForm.controls.newPassword.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.passwordForm.controls.confirmPassword.updateValueAndValidity();
    });
    this.upgradeForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.upgradeError.set(undefined);
    });
    this.upgradeForm.controls.email.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emailAlreadyExists.set(false);
    });
    this.upgradeForm.controls.username.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.usernameAlreadyExists.set(false);
    });
    this.passwordForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.passwordError.set(undefined);
      this.passwordChanged.set(false);
    });
    this.deletePassword.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.deleteError.set(undefined);
    });
  }

  upgradeAccount() {
    if (this.upgradeLoading()) {
      return;
    }
    this.upgradeForm.markAllAsTouched();
    if (this.upgradeForm.invalid) {
      return;
    }
    this.upgradeLoading.set(true);
    const { email, username, password } = this.upgradeForm.getRawValue();
    this.authService
      .upgradeAccount({ email: email.trim().toLowerCase(), username: username.trim(), password })
      .pipe(
        take(1),
        finalize(() => {
          this.upgradeLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.upgradeForm.reset();
        },
        error: (error) => {
          const conflict = getConflictError(error);
          if (conflict) {
            this.emailAlreadyExists.set(conflict.emailAlreadyExists);
            this.usernameAlreadyExists.set(conflict.usernameAlreadyExists);
          } else {
            this.upgradeError.set(getAuthErrorMessage(error));
          }
        },
      });
  }

  changePassword() {
    if (this.passwordLoading()) {
      return;
    }
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      return;
    }
    this.passwordLoading.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.authService
      .changePassword({ currentPassword, newPassword })
      .pipe(
        take(1),
        finalize(() => {
          this.passwordLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.passwordChanged.set(true);
        },
        error: (error) => {
          this.passwordError.set(getAuthErrorMessage(error, 'Current password is invalid'));
        },
      });
  }

  logOut() {
    // Un compte invité n'a que son token : se déconnecter le perd définitivement
    if (
      this.authService.tempAccount() &&
      !window.confirm('You are playing as a guest: logging out will lose your progress forever. Log out anyway?')
    ) {
      return;
    }
    this.authService.logOut();
  }

  logOutAll() {
    if (this.logOutAllLoading()) {
      return;
    }
    this.logOutAllLoading.set(true);
    this.logOutAllError.set(undefined);
    this.authService
      .logOutAll()
      .pipe(
        take(1),
        finalize(() => {
          this.logOutAllLoading.set(false);
        }),
      )
      .subscribe({
        error: (error) => {
          this.logOutAllError.set(getAuthErrorMessage(error));
        },
      });
  }

  deleteAccount() {
    if (this.authService.deleteAccountLoading()) {
      return;
    }
    // Le back n'exige le mot de passe que pour un compte classique
    if (this.authService.tempAccount()) {
      if (window.confirm('Are you sure you want to delete your account?')) {
        this.sendDeleteAccount();
      }
      return;
    }
    if (!this.showDeleteConfirmation()) {
      this.showDeleteConfirmation.set(true);
      return;
    }
    if (!this.deletePassword.value) {
      this.deleteError.set('Password is required');
      return;
    }
    this.sendDeleteAccount(this.deletePassword.value);
  }

  cancelDeleteAccount() {
    this.showDeleteConfirmation.set(false);
    this.deletePassword.reset();
    this.deleteError.set(undefined);
  }

  private sendDeleteAccount(password?: string) {
    this.authService
      .deleteAccount(password)
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          this.deleteError.set(getAuthErrorMessage(error, 'Invalid password'));
        },
      });
  }

  hasError(control: FormControl): boolean {
    return control.touched && control.invalid;
  }
}
