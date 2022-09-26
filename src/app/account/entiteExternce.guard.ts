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
import { AccountService, EntiteExterne } from "./auth/account.service";

@Injectable({ providedIn: "root" })
export class EntiteExterneGuard implements CanActivate {
  constructor(private acocuntService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.acocuntService.entiteExterneEmitter.pipe(
        take(1),
        map((user: EntiteExterne) => {
        if (!!user) {

          return true;
        }
      else{
      return this.router.createUrlTree(['/account','loginEntiteExterne']);
    }
  }
  )
  )
  }
}
