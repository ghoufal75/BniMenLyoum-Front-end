import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap, take, exhaustMap, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
export interface adminModel {
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  profile?: string;
  password: string;
}
export interface Responsable {
  email: string;
  password: string;
}
export class Admin {
  constructor(
    public firstName: string,
    public lastName: string,
    public imgUrl: string,
    public _expirationDate: Date,
    public _token: string,
    public userID
  ) {}
  get token() {
    if (new Date() > this._expirationDate) {
      return null;
    } else {
      return this._token;
    }
  }
}

export class EntiteExterne {
  constructor(
    public email: string,
    public _expirationDate: Date,
    public _token: string,
    public firstConnection: boolean,
    public role: string,
    public userID: string
  ) {}

  get token() {
    if (new Date() > this._expirationDate) {
      return null;
    }
    return this._token;
  }
}
export class Responsable {
  constructor(
    public email: string,
    public _expirationDate: Date,
    public _token: string,
    public firstConnection: boolean,
    public role: string,
    public userID: string
  ) {}

  get token() {
    if (new Date() > this._expirationDate) {
      return null;
    }
    return this._token;
  }
}

@Injectable({ providedIn: "root" })
export class AccountService {
  adminEmitter: BehaviorSubject<Admin> = new BehaviorSubject<Admin>(null);
  responsableEmitter: BehaviorSubject<Responsable> =
    new BehaviorSubject<Responsable>(null);
  firstConnectionSubject: Subject<boolean> = new Subject<boolean>();
  connectedRole: BehaviorSubject<string> = new BehaviorSubject(null);
  entiteExterneEmitter: BehaviorSubject<EntiteExterne> =
    new BehaviorSubject<EntiteExterne>(null);
  private readonly baseUrl = environment.api_link+"/authentication";

  constructor(private http: HttpClient, private router: Router) {}
  signUp(user: adminModel) {
    return this.http
      .post(`${this.baseUrl}/admin/signUp`, user)
      .pipe(catchError(this.errorHandler));
  }
  login(user: adminModel) {
    return this.http.post(`${this.baseUrl}/admin/login`, user).pipe(
      catchError(this.errorHandler),
      tap((data) => {
        return this.handleAuth(
          data["access-token"],
          data.expiresIn,
          data.firstName,
          data.lastName,
          data.imgUrl,
          data.userID
        );
      })
    );
  }
  private handleAuth(
    access_token,
    expiresIn,
    firstName,
    lastName,
    imgUrl,
    userID
  ) {
    const expiration_date = new Date(new Date().getTime() + expiresIn * 1000);
    const newAdmin = new Admin(firstName,lastName,imgUrl, expiration_date, access_token, userID);

    localStorage.setItem("currentAdmin", JSON.stringify(newAdmin));
    this.adminEmitter.next(newAdmin);
    this.connectedRole.next("Admin");

  }
  private handleAuthResponsable(
    access_token,
    expiresIn,
    email,
    firstConnection: boolean,
    userID: string
  ) {
    const expiration_date = new Date(new Date().getTime() + expiresIn * 1000);
    const newResponsable = new Responsable(
      email,
      expiration_date,
      access_token,
      firstConnection,
      "responsable",
      userID
    );
    localStorage.setItem("currentResponsable", JSON.stringify(newResponsable));
    this.responsableEmitter.next(newResponsable);
    this.connectedRole.next("Responsable");

  }

  private handleAuthEntiteExterne(
    access_token,
    expiresIn,
    email,
    firstConnection,
    userID
  ) {

    const expiration_date = new Date(new Date().getTime() + expiresIn * 1000);
    const newEntite = new EntiteExterne(
      email,
      expiration_date,
      access_token,
      firstConnection,
      "entiteExterne",
      userID
    );
    localStorage.setItem("currentEntiteExterne", JSON.stringify(newEntite));
    this.entiteExterneEmitter.next(newEntite);
  }
  autoLoginEntiteExterne() {
    const currentEntiteExterne: {
      _expirationDate: Date;
      _token: string;
      userID: string;
      email: string;
      firstConnection: boolean;
      role: string;
    } = JSON.parse(localStorage.getItem("currentEntiteExterne"));
    if (!currentEntiteExterne) return;
    const entite = new EntiteExterne(
      currentEntiteExterne.email,
      currentEntiteExterne._expirationDate,
      currentEntiteExterne._token,
      currentEntiteExterne.firstConnection,
      currentEntiteExterne.role,
      currentEntiteExterne.userID
    );
    if (!entite.token) return;
    this.entiteExterneEmitter.next(entite);
  }
  logoutEntiteExterne() {
    localStorage.removeItem("currentEntiteExterne");
    this.entiteExterneEmitter.next(null);
  }

  autoLogin() {
    const currentAdmin: {
      firstName: string;
      lastName:string;
      imgUrl:string;
      _expirationDate: string;
      _token: string;
      userID: string;
    } = JSON.parse(localStorage.getItem("currentAdmin"));
    if (!currentAdmin) return;
    const admin = new Admin(
      currentAdmin.firstName,
      currentAdmin.lastName,
      currentAdmin.imgUrl,
      new Date(currentAdmin._expirationDate),
      currentAdmin._token,
      currentAdmin.userID
    );
    if (!admin.token) return;
    this.adminEmitter.next(admin);
    this.connectedRole.next("Admin");
  }
  autoLoginResponsable() {
    const currentResponsable: {
      email: string;
      _expirationDate: string;
      _token: string;
      firstConncetion: boolean;
      role: string;
      userID: string;
    } = JSON.parse(localStorage.getItem("currentResponsable"));
    if (!currentResponsable) return;
    const responsable = new Responsable(
      currentResponsable.email,
      new Date(currentResponsable._expirationDate),
      currentResponsable._token,
      currentResponsable.firstConncetion,
      currentResponsable.role,
      currentResponsable.userID
    );
    if (!responsable.token) return;
    this.responsableEmitter.next(responsable);
    this.connectedRole.next("Responsable");
  }
  loginReponsable(responsable: any) {
    return this.http
      .post(`${this.baseUrl}/responsable/login`, responsable)
      .pipe(
        tap((responsable: any) => {
          this.handleAuthResponsable(
            responsable["access-token"],
            responsable.expiresIn,
            responsable.email,
            responsable.firstConncetion,
            responsable.userID
          );
        })
      );
  }
  loginEntieExterne(entiteExterne: any) {
    return this.http
      .post(`${this.baseUrl}/entiteExterne/login`, entiteExterne)
      .pipe(
        tap((user: any) => {
          this.handleAuthEntiteExterne(
            user["access-token"],
            user.expiresIn,
            user.email,
            user.firstConnection,
            user.userID
          );
        })
      );
  }
  private errorHandler(error: HttpErrorResponse | string): Observable<any> {
    console.log("this is the error : ",error);
    let errorToReturn = "Une erreur inconnue s'est produite.";
    if (error) {
      switch (error) {
        case "Can't find user":
          errorToReturn = "Cet utilisateur n'existe pas";
          break;
        case "Invalid Credentials":
          errorToReturn = "L'email ou le mot de passe est incorrecte";
          break;
        case "User Already exists.":
          errorToReturn = "L'utilisateur avec cet email existe dèja.";
          break;
      }
      return throwError(errorToReturn);
    }
  }
  autoLogout() {
    this.adminEmitter.pipe(take(1)).subscribe((user: Admin) => {
      if (!user) {
        return;
      }
      if (user.token) {
        setTimeout(() => {
          alert("Votre session a expiré");
          this.logOutAdmin();
        }, +user._expirationDate.getTime() - +new Date().getTime());
      }
    });
  }
  autoLogoutResponsable() {
    this.responsableEmitter.pipe(take(1)).subscribe((user: Responsable) => {
      if (!user) {

        return;
      }
      if (user.token) {
        setTimeout(() => {
          this.logOutAdmin();
        }, +user._expirationDate.getTime() - +new Date().getTime());
      }
    });
  }
  logOutAdmin() {
    let isAdmin = false;
    this.adminEmitter.subscribe((admin) => {

      if (!admin) {
        return;
      }
      isAdmin = true;
      return;
    });
    this.adminEmitter.next(null);
    this.responsableEmitter.next(null);
    localStorage.removeItem("currentAdmin");
    localStorage.removeItem("currentResponsable");
    if (isAdmin) {
      this.router.navigate(["/account", "login"]);
    } else {
      this.router.navigate(["/account", "loginResponsable"]);
    }
  }

  changePassword(password: string) {
    return this.responsableEmitter.pipe(
      take(1),
      exhaustMap((responsable) => {

        let header = new HttpHeaders({
          Authorization: `Bearer ${responsable._token}`,
        });
        return this.http.patch(
          environment.api_link+"/account-management/responsable",
          { password },
          { headers: header }
        );
      })
    );
  }
  changeEntiteExternePassword(password: string) {
    return this.entiteExterneEmitter.pipe(
      take(1),
      exhaustMap((user) => {

        let header = new HttpHeaders({
          Authorization: `Bearer ${user._token}`,
        });
        return this.http.patch(
          environment.api_link+"/account-management/entiteExterne",
          { password },
          { headers: header }
        );
      })
    );
  }
}
