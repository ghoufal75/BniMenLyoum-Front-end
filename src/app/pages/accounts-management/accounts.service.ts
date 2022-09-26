import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntiteExterneModel } from "./models/eniteExterne.model";
import { ResponsableModel } from "./models/responsable.model";
import { environment } from "src/environments/environment";

@Injectable()
export class AccountsService{
readonly baseUrl=environment.api_link+'/authentication/'
  constructor(private http:HttpClient){}
    getAllResponsables(){
      return this.http.get(this.baseUrl+"responsable");
    }
    signUpResponsable(data:ResponsableModel){
      return this.http.post(this.baseUrl+'responsable/signup',data);
    }
    signUpEntiteExterne(data:EntiteExterneModel){
      return this.http.post(this.baseUrl+'entiteExterne/signUp',data);
    }
    getAllClients(){
      return this.http.get(this.baseUrl+'lambdaUser');
    }
    getAllEntiteExterne(){
      return this.http.get(this.baseUrl+'entiteExterne');
    }
    getAllBureauOrdre(){
      return this.http.get(this.baseUrl+'bureauOrdre');
    }

}
