import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WakeUpService {
  serverIsWakingUp = signal(false);
}
