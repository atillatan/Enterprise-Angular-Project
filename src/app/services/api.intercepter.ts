import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SessionStorageService } from 'ngx-webstorage';
import { ConfigService } from './config.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceResponse } from '../code/dto';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    private sessionStorage: SessionStorageService;
    private configService: ConfigService;
    private toastr: ToastrService;
    private translate: TranslateService;

    constructor(
        private injector: Injector
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const requestTimestamp = new Date().getTime();
        this.sessionStorage = this.injector.get(SessionStorageService);
        this.configService = this.injector.get(ConfigService);
        this.toastr = this.injector.get(ToastrService);
        this.translate = this.injector.get(TranslateService);
        let clonedRequest = request;

        const userLanguage = sessionStorage.getItem('ng2-webstorage|current_language');
        if (userLanguage != null) {
            clonedRequest = request.clone({ setHeaders: { 'Accept-Language': userLanguage.substring(1, 3) } });
        } else {
            if (this.configService.config != null) {
                const defLang = this.configService.config.DefaultLanguage.substring(1, 3);
                clonedRequest = request.clone({ setHeaders: { 'Accept-Language': defLang } });
            }
        }

        return next.handle(clonedRequest).pipe(
            tap(response => {

                if (response instanceof HttpResponse) {
                    const responseTimestamp = new Date().getTime();
                    const elapsed_ms = responseTimestamp - requestTimestamp;
                    console.log(response.url + ' --> ' + elapsed_ms + ' ms');

                    this.handleResponseMessage(response);
                    console.log(response);
                }
            }),
            catchError(err => {
                console.log('Caught error', err);
                return Observable.throw(err);
            })
        );
    }

    private handleResponseMessage(response) {
        if (response != null && response.body != null) {
            const serviceResponse: ServiceResponse<any> = response.body;

            if (response.status !== 200) {

                this.translate.get('MSG_ERROR').subscribe((res: string) => {
                    this.toastr.error(res, 'Error');
                    console.log(response.statusText);
                });
            }

            if (serviceResponse != null &&
                serviceResponse.IsSuccess != null &&
                serviceResponse.Message != null &&
                serviceResponse.Message.length > 0) {

                if (!serviceResponse.IsSuccess) {
                    this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                        setTimeout(() => this.toastr.error(res, 'Error'));
                        console.log(serviceResponse.Message);
                    });
                } else {

                    switch (serviceResponse.ResultType) {
                        case 1:
                            this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                                this.toastr.info(res);
                            });
                            break;
                        case 2:
                            this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                                this.toastr.warning(res);
                            });
                            break;
                        case 3:
                            this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                                this.toastr.success(res);
                            });
                            break;
                        case 4:
                            this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                                this.toastr.warning(res);
                            });
                            break;
                        case 5:
                            this.translate.get(serviceResponse.Message).subscribe((res: string) => {
                                this.toastr.error(res);
                            });
                            break;
                        default:
                            break;
                    }
                    console.log(serviceResponse.Message);
                }
            }
        }
    }

}
