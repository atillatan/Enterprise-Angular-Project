import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log(route + '' + state);
    console.log('AuthGuard, canActivate');

    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        console.log('AuthGuard, canActivate isAuthorized: ' + isAuthorized);

        if (isAuthorized) {
          return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
