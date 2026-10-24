import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { merge } from 'rxjs';
import { UpgradeGuestParams } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClassicPageComponent } from '../classic-page.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

interface UpgradeForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

// Mêmes règles que UpgradeGuestDto côté hordes-api
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const PASSWORD_MAX = 72;

const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const { password, confirmPassword } = (group as FormGroup<UpgradeForm>).controls;
  return confirmPassword.value && password.value !== confirmPassword.value ? { noMatchPassword: true } : null;
};

@Component({
  selector: 'app-settings',
  imports: [ClassicPageComponent, IconComponent, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  authService = inject(AuthService);

  goBackButton = false;

  upgradeForm = new FormGroup<UpgradeForm>(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(254)],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.minLength(3), Validators.maxLength(15), Validators.pattern(USERNAME_PATTERN)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(PASSWORD_MAX)],
      }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatch },
  );

  constructor() {
    // Le conflit affiché ne concerne plus les valeurs modifiées
    const { email, username } = this.upgradeForm.controls;
    merge(email.valueChanges, username.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.authService.upgradeGuestConflict.set(null));
  }

  upgradeAccount() {
    this.upgradeForm.markAllAsTouched();
    if (this.upgradeForm.invalid) {
      return;
    }
    const { email, username, password } = this.upgradeForm.getRawValue();
    const params: UpgradeGuestParams = { email: email.trim(), password };
    if (username.trim()) {
      params.username = username.trim();
    }
    this.authService.upgradeGuest(params);
  }

  fieldHasError(field: keyof UpgradeForm): boolean {
    const control = this.upgradeForm.controls[field];
    return control.touched && control.invalid;
  }

  passwordsMismatch(): boolean {
    return this.upgradeForm.controls.confirmPassword.touched && this.upgradeForm.hasError('noMatchPassword');
  }

  deleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (confirmed) {
      this.authService.deleteAccount();
    }
  }
}
