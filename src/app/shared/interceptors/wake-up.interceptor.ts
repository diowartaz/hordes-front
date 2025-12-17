import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { WakeUpService } from 'src/app/services/wake-up/wake-up.service';

export const wakeUpInterceptor: HttpInterceptorFn = (req, next) => {
  const wakeUpService = inject(WakeUpService);

  const wakeUpTimeOut = setTimeout(() => {
    wakeUpService.serverIsWakingUp.set(true);
  }, 5000);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(wakeUpTimeOut);
      wakeUpService.serverIsWakingUp.set(false);
    }),
  );
};
