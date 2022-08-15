import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, Subject} from "rxjs";
import { map, exhaustMap,switchMap, take, tap  } from "rxjs/operators";
import { AccountService, Admin } from "./account.service";

@Injectable({ providedIn: "root" })
export class GeneralAuthGuard implements CanActivate {
  constructor(private acocuntService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.acocuntService.adminEmitter.pipe(
        take(1),
        map((user: Admin) => {
        if (!!user) {
          console.log("You are connected, this is from the guard");
          return true;
        }
      else{
      let response=false;
      this.acocuntService.responsableEmitter.subscribe(res=>{
        console.log("this is the responsable : ",res);
          if(res === null || res=== undefined){
          response=false;
          return;
          }
          response=true;
          return;

        })
      console.log("this is the response : ",response);
      if(response){

        return true;
      }
      return this.router.createUrlTree(['/account','login']);
    }
  }
  )
  )
  }
}
