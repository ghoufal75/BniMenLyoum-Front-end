import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError, BehaviorSubject } from "rxjs";
import { catchError,take,tap } from "rxjs/operators";
interface UserModel{
  firstName:string;
  lastName:string;
  email:string;
  password:string;
}
interface LoginResModel{
  access_token:string;
  email:string;
  expiresIn:number;
}
class User{
  constructor(public email:string,public _token:string,public _tokenExpirationDate:Date){}
  get token(){
    if(this._tokenExpirationDate < new Date()){
      return null;
    }
    return this._token;
  }

}
interface authModel{
  email:string;
  password:string;
}
@Injectable({providedIn:'root'})
export class AuthenticationService {
  user:BehaviorSubject<User>=new BehaviorSubject(null);
  readonly baseAuthUrl="http://localhost:3000/authentication/"
  constructor(private http: HttpClient) {}
  signUp(user:UserModel){
  return  this.http.post(`${this.baseAuthUrl}lambdauser/signup`,user).pipe(catchError(this.handleErrors));
  }
  private handleErrors(error:HttpErrorResponse):Observable<any>{
    console.log(error);
    let errorMessage="Une erreur inconnue s'est produite."
    if(error.error.message && error.error.message.length != 0){
      switch(error.error.message[0]){
        case "Password must not containe special charachters, you should use A-Z a-z 0-9 characters with minimum length of 12.":
          errorMessage="Le mot de passe ne doit pas contenir de caractères spéciaux, que des miniscules, des majiscules, et des nombres."
          break;
        default:
          break;
      }
    }
    return throwError(errorMessage);
  }
  signIn(user:authModel){
    return this.http.post(`${this.baseAuthUrl}lambdauser/login`,user).pipe(tap((res:LoginResModel)=>{
      this.handleAuth(res.email,res.access_token,+res.expiresIn);
    }));
  }
  private handleAuth(email:string,token:string,expiresIn:number){
    let expiration_date=new Date(new Date().getTime() + +expiresIn*3600);
    const user= new User(email,token,expiration_date);
    localStorage.setItem('connectedUser',JSON.stringify(user));
    this.user.next(user);
  }
  autoLogin(){
    this.user.pipe(take(1)).subscribe(user=>{
      if(!user){
        let newUser=JSON.parse(localStorage.getItem('connectedUser'));
        if(!newUser){
          return;
        }
        this.user.next(newUser);
      }
    })
  }
  logout(){
    localStorage.removeItem('connectedUser');
    this.user.next(null);
  }
}
