import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router, Event as RouterEvent, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  isCollapsed: Boolean = true;
  isAuthorizedSubscription: Subscription;
  isAuthorized: Boolean = false;
  userData: any;
  userInfo: any;
  loading = true;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private sessionStorage: SessionStorageService,
    private translateService: TranslateService,
    router: Router
  ) {

    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    });
  }


  ngOnInit(): void {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
        if (this.isAuthorized === true) {
          this.saveUserInfo();
        }
      });
  }

  private doCallbackLogicIfRequired() {
    if (window.location.hash) {
      this.oidcSecurityService.authorizedCallback();
    }
  }

  ngOnDestroy(): void {
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  saveUserInfo() {
    // GetUserInfo and set sessionStorage
    this.oidcSecurityService.getUserData().subscribe(
      (data) => {
        if (data !== '') {
          this.userData = data;
          const id: number = +this.userData.sub;
          // Get your user informatin form service
          // this.userService.getUser(id).subscribe(serviceResponse => {
          //   if (serviceResponse != null) {
          //     this.userInfo = serviceResponse.Data;
          //     this.sessionStorage.clear('userinfo');
          //     this.sessionStorage.store('userinfo', this.userInfo);
          //   }
          // });
        }
      }
    );
  }

  langChange(lang: string) {
    this.translateService.use(lang);
  }



}
