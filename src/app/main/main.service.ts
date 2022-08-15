import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
export interface SearchModel {
  nom: string;
  topographe: string;
  referenceFonciere: string;
}
@Injectable()
export class MainService {
  constructor(private http: HttpClient) {}
  searchProject(data: SearchModel) {
    return this.http.get(
      `http://localhost:3000/geo-ins/singleProject/${data.nom}/${data.topographe}/${data.referenceFonciere}`
    );
  }
  sendReclamation(data) {
    return this.http.post("http://localhost:3000/reclamations", data);
  }
}
