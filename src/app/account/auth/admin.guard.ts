import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";
import { AccountService } from "./account.service";
@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate{
  constructor(private accountServcie:AccountService,private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    return this.accountServcie.connectedRole.pipe(take(1),map(role=>{
        if(role==='Admin'){
          return true;
        }
        return this.router.createUrlTree(['/dashboard']);
      }))
  }
}
