import { HttpErrorResponse } from '@angular/common/http';
import { ConflictError } from 'src/app/models/auth';

/**
 * Erreur 409 du back : indique si l'email et/ou le pseudo sont déjà pris
 */
export const getConflictError = (error: unknown): ConflictError | undefined => {
  if (error instanceof HttpErrorResponse && error.status === 409 && typeof error.error?.error === 'object') {
    return error.error.error as ConflictError;
  }
  return undefined;
};

/**
 * Message lisible pour une erreur renvoyée par les routes d'authentification
 * @param unauthorizedMessage message affiché pour un 401/403 (identifiants ou mot de passe invalides)
 */
export const getAuthErrorMessage = (error: unknown, unauthorizedMessage = 'Invalid credentials'): string => {
  if (!(error instanceof HttpErrorResponse)) {
    return 'An error occurred, please try again';
  }
  switch (error.status) {
    case 0:
      return 'Server unreachable, please try again later';
    case 401:
    case 403:
      return unauthorizedMessage;
    case 429:
      return 'Too many attempts, please try again later';
    case 400:
      // Messages de validation du back (joi), ex : "password" length must be at least 8 characters long
      return typeof error.error?.error === 'string' ? error.error.error.replace(/"/g, '') : 'Invalid data';
    default:
      return 'An error occurred, please try again';
  }
};
