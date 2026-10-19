import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { WakeUpService } from 'src/app/services/wake-up/wake-up.service';

const WAKE_UP_DELAY_MS = 5000;

// Affiche le message « serveur en train de se réveiller » tant qu'au moins une requête dépasse 5 s
export const wakeUpInterceptor: HttpInterceptorFn = (req, next) => {
  const wakeUpService = inject(WakeUpService);
  let isSlow = false;

  const wakeUpTimeOut = setTimeout(() => {
    isSlow = true;
    wakeUpService.slowRequestStarted();
  }, WAKE_UP_DELAY_MS);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(wakeUpTimeOut);
      if (isSlow) {
        wakeUpService.slowRequestEnded();
      }
    }),
  );
};
