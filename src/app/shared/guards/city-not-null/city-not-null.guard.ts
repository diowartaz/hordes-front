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
export class CityNotNullGuard implements CanActivate, CanActivateChild {
  constructor(private cityService: CityService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.cityService.userPlayerCity$.getValue()) {
      this.router.navigate(['create-city']);
      return false;
    }
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.cityService.userPlayerCity$.getValue()) {
      this.router.navigate(['create-city']);
      return false;
    }
    return true;
  }
}
