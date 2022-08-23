import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { UserService } from './user.service';
import { from, Observable, throwError } from 'rxjs/index';
import { catchError, tap } from 'rxjs/internal/operators';
import { ToastrManager } from 'ng6-toastr-notifications';

export const InterceptorSkipAuthHeader = 'X-SkipAuth-Interceptor';
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private userService: UserService,
    private toastr: ToastrManager) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.toastr.errorToastr('No internet connection please check you internet connection and try again')
      return throwError(new HttpErrorResponse({ error: 'No internet connection.' }));

    } else {
      // else return the normal request
      // return next.handle(request);
      return from(this.handleAccess(request, next));
    }
  }

  private handleAccess(request, next): Observable<HttpEvent<any>> {
    // let request = request;

    const tokenKey = this.userService.getToken();
    const headerSettings: { [name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (tokenKey) {
      headerSettings['Authorization'] = 'Bearer ' + tokenKey.token;
    }
    if (request.headers.has(InterceptorSkipAuthHeader)) {
      delete headerSettings['Authorization'];
      delete headerSettings[InterceptorSkipAuthHeader];
      request = request.clone({ headers: request.headers.delete(InterceptorSkipAuthHeader) });
    }
    if (!headerSettings['Content-Type'])
      headerSettings['Content-Type'] = 'application/json';
    else
      delete headerSettings['Content-Type'];
    const newHeader = new HttpHeaders(headerSettings);

    request = request.clone({
      headers: newHeader
    });
    // return next.handle(request).toPromise();
    // method 1

    return next.handle(request).pipe(catchError(err => {
      // if (err.status === 401 && err.statusText.includes('Unauthorized')) {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.toastr.errorToastr('Please login again');
        this.userService.logout();
      }
      const error = err.message || err.statusText;
      // this.toastr.errorToastr(error);
      return throwError(error);
    }))
    // }

    // method 2
    //   return next.handle(request).pipe(tap(evt => { }),
    //     catchError((err, caught) => {
    //       if (err.status === 501) {
    //         this.userService.logout();
    //         const error = err.error.message || err.statusText;
    //         this.toastr.errorToastr(error, '', {
    //           position: 'bottom-right'
    //         });

    //       }

    //       return new Observable<HttpEvent<any>>();
    //     })
    //   );
    // }
  }
}
