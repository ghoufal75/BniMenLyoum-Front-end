import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, switchMap, take } from "rxjs/operators";
import { AccountService } from "./account.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private accountService:AccountService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     return this.accountService.adminEmitter.pipe(take(1),switchMap(user=>{
      console.log(user);
      if(!user){
        return this.accountService.responsableEmitter.pipe(take(1),exhaustMap(resp=>{
          if(!resp){
            return next.handle(req);
          }
          let httpHeader={'Authorization': `Bearer ${resp._token}`}
          const newReq=req.clone({setHeaders:httpHeader})
          return next.handle(newReq);
        }));
      }
      console.log("token is : ",user._token);
      let httpHeader={'Authorization': `Bearer ${user._token}`}
      const newReq=req.clone({setHeaders:httpHeader})
      return next.handle(newReq);
     }))
  }
}
