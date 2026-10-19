import { WritableSignal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

/**
 * Lance une requête protégée contre les doubles envois : ne fait rien si `loading` est déjà à true,
 * sinon le passe à true pendant la requête. Les erreurs sont affichées par l'errorInterceptor,
 * `onError` ne sert qu'aux traitements spécifiques à l'appelant.
 */
export function runRequest<T>(
  loading: WritableSignal<boolean>,
  request: Observable<T>,
  onSuccess: (response: T) => void,
  onError?: (error: unknown) => void,
): void {
  if (loading()) {
    return;
  }
  loading.set(true);
  request.pipe(finalize(() => loading.set(false))).subscribe({
    next: onSuccess,
    error: (error) => onError?.(error),
  });
}
