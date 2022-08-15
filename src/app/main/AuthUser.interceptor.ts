import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";
import { AuthenticationService } from "./auth.service";
@Injectable()
export class AuthUserInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        let httpHeader = { Authorization: `Bearer ${user._token}` };
        const newReq = req.clone({ setHeaders: httpHeader });
        return next.handle(newReq);
      })
    );
  }
}
