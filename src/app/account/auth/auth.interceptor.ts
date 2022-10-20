import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, switchMap, take } from "rxjs/operators";
import { AccountService } from "./account.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private accountService:AccountService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("interceptor is working")
    if(req.url.includes('amazon')){
      console.log("Amazon req detected");
      return next.handle(req);
    }
    else{
      console.log("normal req");
     return this.accountService.adminEmitter.pipe(take(1),switchMap(user=>{

      if(!user){
        console.log("there is no admin");
        return this.accountService.responsableEmitter.pipe(take(1),exhaustMap(resp=>{
          if(!resp){
            return this.accountService.entiteExterneEmitter.pipe(take(1),exhaustMap((res:any)=>{
                if(!res){

                  return next.handle(req);
                }
                else{

                  let httpHeader={'Authorization': `Bearer ${res._token}`}
                  const newReq=req.clone({setHeaders:httpHeader})
                  return next.handle(newReq);
                }
            }))
          }
          let httpHeader={'Authorization': `Bearer ${resp._token}`}
          const newReq=req.clone({setHeaders:httpHeader})
          return next.handle(newReq);
        }));
      }
      console.log("there is an admin here and this is his token : ",user._token);
      let httpHeader={'Authorization': `Bearer ${user._token}`}
      const newReq=req.clone({setHeaders:httpHeader})
      return next.handle(newReq);
     }))
    }
  }
}
