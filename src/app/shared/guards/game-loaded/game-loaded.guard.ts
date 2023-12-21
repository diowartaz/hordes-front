import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoadedGuard implements CanActivate, CanActivateChild {
  constructor(private cityService: CityService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guardFunction(route, state)
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guardFunction(childRoute, state)
  }

  guardFunction(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.cityService.playerLoaded$.getValue()) {
      if (state.url.split("/")[1] === "play") {
        localStorage.setItem('play-route', state.url.split("/")[2])
      }
      this.router.navigate(['load-player']);
      return false
    }
    return true;
  }
}
