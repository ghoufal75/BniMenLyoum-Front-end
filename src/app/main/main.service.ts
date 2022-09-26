import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
export interface SearchModel {
  nom: string;
  topographe: string;
  referenceFonciere: string;
}
@Injectable()
export class MainService {
  constructor(private http: HttpClient) {}
  searchProject(data: string) {
    return this.http.get(
      environment.api_link+`/geo-ins/project/${data}`
    );
  }
  sendReclamation(data) {
    return this.http.post(environment.api_link+"/reclamations", data);
  }
}
