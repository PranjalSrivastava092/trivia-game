import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private api: ApiService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    if (this.api.isLoggedIn) {
      return true;
    }
    else {
      this.goToLogin();
      return false;
    }
  }

  private goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
