import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { firstSegment, STATE_LESS_ROUTES } from 'src/app/models/router';

/**
 * Mémorise le dernier écran visité hors pages secondaires (profil, classement, wiki…)
 * pour que le bouton retour y ramène en un clic, quel que soit le nombre de pages enchaînées.
 */
@Injectable({
  providedIn: 'root',
})
export class ReturnUrlService {
  private router = inject(Router);

  private returnUrl: string | null = null;

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if (!STATE_LESS_ROUTES.includes(firstSegment(event.urlAfterRedirects))) {
        this.returnUrl = event.urlAfterRedirects;
      }
    });
  }

  // Sans écran d'origine (accès direct à une page secondaire), les guards choisissent l'écran selon l'état
  back(): void {
    this.router.navigateByUrl(this.returnUrl ?? '/');
  }
}
