import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WakeUpService {
  private slowRequests = signal(0);
  serverIsWakingUp = computed(() => this.slowRequests() > 0);

  slowRequestStarted(): void {
    this.slowRequests.update((nb) => nb + 1);
  }

  slowRequestEnded(): void {
    this.slowRequests.update((nb) => Math.max(nb - 1, 0));
  }
}
