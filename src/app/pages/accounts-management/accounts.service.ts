import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponsableModel } from "./models/responsable.model";

@Injectable()
export class AccountsService{
readonly baseUrl='http://localhost:3000/authentication/'
  constructor(private http:HttpClient){}
    getAllResponsables(){
      return this.http.get(this.baseUrl+"responsable");
    }
    signUpResponsable(data:ResponsableModel){
      return this.http.post(this.baseUrl+'responsable/signup',data);
    }
    getAllClients(){
      return this.http.get(this.baseUrl+'lambdaUser');
    }
    getAllEntiteExterne(){
      return this.http.get(this.baseUrl+'entiteExterne')
    }
    getAllBureauOrdre(){
      return this.http.get(this.baseUrl+'bureauOrdre')
    }

}
