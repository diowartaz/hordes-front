import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Injectable({
  providedIn: 'root'
})
export class StateGuard implements CanActivate, CanActivateChild {
  statesToRoutes: { [key: string]: string; } = {
    noCity: "create-city",
    playing: "play",
    deathRecap: "death-recap",
    recap: "recap",
  }
  routesToStates: { [key: string]: string; } = {

  }
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
    if (this.cityService.userPlayerState$.getValue().length == 0) {
      this.router.navigate(['load-player']);
      return false
    }
    let userPlayerState: string = ""
    for (const [key, value] of Object.entries(this.statesToRoutes)) {
      if (value === state.url.slice(1)) {
        userPlayerState = key
      }
    }
    console.log("----------")
    console.log("try url", state.url.slice(1))
    if (this.cityService.userPlayerState$.getValue() === userPlayerState) {
      console.log("ok")
      return true
    } else {
      console.log("nok")
      console.log(userPlayerState, this.cityService.userPlayerState$.getValue(), this.statesToRoutes[this.cityService.userPlayerState$.getValue()])
      this.router.navigate([this.statesToRoutes[this.cityService.userPlayerState$.getValue()]]);
      return false
    }
  }
}
