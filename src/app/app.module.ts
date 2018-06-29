
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
  MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
  MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule,
  MatFormFieldModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { Ng2Webstorage, SessionStorageService } from 'ngx-webstorage';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import { AuthInterceptor } from './services/auth.intercepter';
import { AuthGuard } from './services/auth.guard';
import { ApiInterceptor } from './services/api.intercepter';
import { ConfigService } from './services/config.service';
import { CrudService } from './services/crud.service';

import { AppComponent } from './root/app.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent, ExampleDialogComponent } from './contact/contact.component';
import { UserComponent } from './user/user.component';


export function initialize(configService: ConfigService): Function {
  return () => configService.loadConfig(`http://localhost:5001/api/js/json/config.js`);
}

export function loadTranslate(http: HttpClient) {
  return new TranslateHttpLoader(http, 'http://localhost:5001/api/js/json/languages/', '.js');
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkTableModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule,
    MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule,
    MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule,
    MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule,
    MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule, MatFormFieldModule,
    Ng2Webstorage,
    AuthModule.forRoot(),
    ToastrModule.forRoot({ closeButton: true, timeOut: 2000, positionClass: 'toast-bottom-right' }),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: loadTranslate, deps: [HttpClient] }
    })
  ],
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    HomeComponent,
    ContactComponent,
    ExampleDialogComponent,
    UserComponent,
    DeleteConfirmationComponent

  ],
  providers: [
    ConfigService,
    CrudService,
    OidcSecurityService,
    AuthGuard,
    { provide: APP_INITIALIZER, useFactory: initialize, multi: true, deps: [ConfigService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ExampleDialogComponent, DeleteConfirmationComponent]
})
export class AppModule {

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private configService: ConfigService,
    private translate: TranslateService,
    private sessionStorage: SessionStorageService
  ) {
    console.log('APP STARTING');

    this.configService.onConfigurationLoaded.subscribe(() => {
      console.log('Configuration loaded.');
      this.configService.setupSSO(this.oidcSecurityService);

      this.translate.setDefaultLang(this.configService.config.DefaultLanguage);
      this.translate.use(this.configService.config.DefaultLanguage);

      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.sessionStorage.store('current_language', event.lang);
      });

    });
  }
}

