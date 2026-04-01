sample 


Hi , my compoany (SOLVE IT SERVICES PTY LTD), has been a registered ABN company for 8 years contracted for Woolworth / Optpus / Engergy Australia / NSW Transport / Service Australia, is there a way I can get registered via buyict?


```
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorRedirectInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 400) {
          this.router.navigate(['/error']);
        }

        return throwError(() => error);
      })
    );
  }
}

```

register

```
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorRedirectInterceptor } from './interceptors/error-redirect.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorRedirectInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}

```
