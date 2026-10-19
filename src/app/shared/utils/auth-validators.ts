import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from 'src/app/models/auth';

// Mêmes règles que le back : un formulaire valide ici ne doit pas être refusé là-bas
export const emailValidators: ValidatorFn[] = [Validators.required, Validators.email, Validators.maxLength(254)];

export const usernameValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(USERNAME_MIN_LENGTH),
  Validators.maxLength(USERNAME_MAX_LENGTH),
  Validators.pattern(USERNAME_PATTERN),
];

export const newPasswordValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(PASSWORD_MIN_LENGTH),
  Validators.maxLength(PASSWORD_MAX_LENGTH),
];

/**
 * Le champ doit être identique au champ `otherControlName` du même formulaire
 */
export const matchValidator =
  (otherControlName: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const other = control.parent?.get(otherControlName);
    if (!control.value || !other) {
      return null;
    }
    return control.value === other.value ? null : { noMatch: true };
  };
