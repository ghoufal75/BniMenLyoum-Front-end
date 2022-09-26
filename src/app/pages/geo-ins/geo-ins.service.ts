import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AccountService } from "src/app/account/auth/account.service";
import { environment } from "src/environments/environment";
@Injectable()
export class GeoInsService {
  constructor(private http: HttpClient, private accountServ: AccountService) {
    this.accountServ.adminEmitter.subscribe(user=>{
    })
  }

  //  Managing Projects

  getMorcellements() {
    return this.http.get(environment.api_link+"/geo-ins/morcellements");
  }
  getConstructions() {
    return this.http.get(environment.api_link+"/geo-ins/constructions");

  }
  getLotissements() {
    return this.http.get(environment.api_link+"/geo-ins/lotissements");
  }
  getGroupeHabitations() {
    return this.http.get(environment.api_link+"/geo-ins/groupeHabitations");
  }
  addMorcellements(data: any) {
    return this.http.post(environment.api_link+"/geo-ins/morcellements", data);
  }
  addConstructions(data: any) {
    return this.http.post(environment.api_link+"/geo-ins/constructions", data);
  }
  addLotissements(data: any) {
    return this.http.post(environment.api_link+"/geo-ins/lotissements", data);
  }
  addGroupeHabitations(data: any) {
    return this.http.post(
      environment.api_link+"/geo-ins/groupeHabitations",
      data
    );
  }

  // Managing Maitres d'ouvrages
  getMaitreOuvragePhysique() {
    return this.http.get(environment.api_link+"/geo-ins/maitreOuvragePhysique");
  }
  getMaitreOuvrageMoral() {
    return this.http.get(environment.api_link+"/geo-ins/maitreOuvrageMoral");
  }
  getOrganismePublic() {
    return this.http.get(environment.api_link+"/geo-ins/organismePublic");
  }

  addMaitreOuvragePhysique(form: any) {
    return this.http.post(
      environment.api_link+"/geo-ins/maitreOuvragePhysique",
      form
    );
  }
  addMaitreOuvrageMoral(form: any) {
    return this.http.post(
      environment.api_link+"/geo-ins/maitreOuvrageMoral",
      form
    );
  }
  addOrganismePublic(form: any) {
    return this.http.post(
      environment.api_link+"/geo-ins/organismePublic",
      form
    );
  }

  fetchMaitreOuvrageWithName(data: string, fetchingCriteria) {
    return this.http.get(
      environment.api_link+`/geo-ins/maitreOuvrage/${fetchingCriteria}/${data}`
    );
  }

  fetchProjectsWithMaitreOuvrage(data: string, fetchingCriteria) {
    return this.http.get(
      environment.api_link+`/geo-ins/projects/${fetchingCriteria}/${data}`
    );
  }
  updateProjectLocation(data: any) {
    return this.http.patch(
      environment.api_link+"/geo-ins/projecLocation",
      data
    );
  }
  deleteProject(project: any) {
    return this.http.delete(
      environment.api_link+`/geo-ins/project/${project._id}`
    );
  }
  updateConstruction(data: any, id: string) {
    return this.http.patch(
      environment.api_link+`/geo-ins/constructions/${id}`,
      data
    );
  }
  updateMorcellement(data: any, id: string) {
    return this.http.patch(
      environment.api_link+`/geo-ins/morcellements/${id}`,
      data
    );
  }
  updateLotissement(data: any, id: string) {
    return this.http.patch(
      environment.api_link+`/geo-ins/lotissements/${id}`,
      data
    );
  }
  updateGroupeHabitation(data: any, id: string) {
    return this.http.patch(
      environment.api_link+`/geo-ins/groupeHabitations/${id}`,
      data
    );
  }
  deleteMaitreOuvrage(id: string) {
    return this.http.delete(
      environment.api_link+`/geo-ins/maitreOuvrage/${id}`
    );
  }
  updateMaitreOuvrage(id, data) {
    return this.http.patch(
      environment.api_link+`/geo-ins/maitreOuvrage/${id}`,
      data
    );
  }
  approuverProjet(projet: any) {
    return this.http.patch(
      environment.api_link+`/geo-ins/project/approbation/${projet._id}`,
      {}
    );
  }
  rejeterProjet(projet: any) {
    return this.http.patch(
      environment.api_link+`/geo-ins/project/rejet/${projet._id}`,
      {}
    );
  }
  reporterProjet(projet: any, date: string, report: boolean) {
    return this.http.patch(
      environment.api_link+`/geo-ins/project/reportation/${projet._id}`,
      { date, report }
    );
  }
}
